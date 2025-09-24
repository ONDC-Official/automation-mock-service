import { NextFunction, Response } from "express";
import { ApiRequest } from "../routes/manual";
import logger from "@ondc/automation-logger";
import { getFlowCompleteStatus } from "./flow-mapping-service";
import { getFlowStatusService } from "./mock-flow-status-service";
import { getMockActionObject } from "../config/mock-config";
import {
	loadMockSessionData,
	saveCompleteData,
	saveDataForConfig,
} from "./data-services";
import { setAckResponse } from "../utils/ackUtils";
import {
	sendToApiService,
	sendToApiServiceAboutForm,
} from "../utils/request-utils";
import { getLoggerData } from "../utils/logger";

export async function ValidateAndSaveIncoming(
	req: ApiRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const txData = req.transactionData;
		const subsUrl = req.subscriberUrl;
		const txId = req.transactionId;
		const flow = req.flow;
		const body = req.body;
		if (!txData || !subsUrl || !txId || !flow) {
			logger.error(
				"Missing required data in incoming request",
				getLoggerData(req)
			);
			res
				.status(500)
				.send("<INTERNAL-ERROR> Flow or Transaction data not found");
			return;
		}
		const flowStatus = await getFlowStatusService(
			txId,
			subsUrl,
			getLoggerData(req)
		);
		const mockSessionData = await loadMockSessionData(txId, subsUrl);
		const flowCompleteStatus = getFlowCompleteStatus(
			txData,
			flow,
			flowStatus.status,
			mockSessionData
		);
		let found = false;
		for (let index = 0; index < flowCompleteStatus.sequence.length; index++) {
			const step = flowCompleteStatus.sequence[index];
			const data = step.payloads;
			if (!data || data.entryType === "FORM" || step.actionType === "HTML_FORM")
				continue;
			if (data && data.payloads.length > 0) {
				const uniqueKey = `${data.action}::${data.messageId}::${data.timestamp}`;
				const requestKey = `${body.context.action}::${body.context.message_id}::${body.context.timestamp}`;
				if (uniqueKey === requestKey) {
					try {
						const mockActionOb = getMockActionObject(step.actionId);
						found = true;
						const valid = await mockActionOb.validate(body, mockSessionData);
						if (!valid.valid) {
							logger.info(
								`Validation failed for action: ${step.actionId}, Message: ${valid.message}`
							);
							res.status(200).send(setAckResponse());

							const action = step.actionType.startsWith("on_")
								? step.actionType.slice(3)
								: `on_${step.actionType}`;

							const errBody = {
								context: {
									...body.context,
									action: action,
									timestamp: new Date().toISOString(),
								},
								error: {
									code: valid.code || "VALIDATION_ERROR",
									message: valid.message || "Validation failed",
								},
							};

							// Add a 1-second delay
							await new Promise((resolve) => setTimeout(resolve, 1000));

							await sendToApiService(action, errBody, {
								subscriber_url: subsUrl,
								flow_id: flow.id,
								session_id: txData.sessionId,
							});
							res.status(200).send(setAckResponse());
							return;
						}
						if (index < flowCompleteStatus.sequence.length - 1) {
							const nextStep = flowCompleteStatus.sequence[index + 1];
							if (nextStep.actionType === "HTML_FORM") {
								const fromAction = getMockActionObject(nextStep.actionId);
								const validationResult = await fromAction.validate(
									{},
									mockSessionData
								);
								if (!validationResult.valid) {
									await sendToApiServiceAboutForm(
										subsUrl,
										txId,
										nextStep.actionId,
										"HTML_FORM",
										req.body.context.version ?? req.body.context.core_version,
										undefined,
										{
											code: validationResult.code || "FORM_VALIDATION_ERROR",
											message:
												validationResult.message || "Form Validation failed",
										}
									);
									res.status(200).send(setAckResponse());
									return;
								} else {
									try {
										const saveData = mockActionOb.saveData;
										await saveDataForConfig(saveData, body);
										const saveDataForm = await fromAction.__forceSaveData(
											mockSessionData
										);
										await saveCompleteData(JSON.stringify(saveDataForm), txId);
										break;
									} catch (err) {
										throw err;
									}
								}
							}
						}
						const saveData = mockActionOb.saveData;
						await saveDataForConfig(saveData, body);
					} catch (error) {
						logger.error(
							"Error while validating and saving " + step.actionId,
							{},
							error
						);
						next();
					}
					break;
				}
			}
		}
		if (found) {
			logger.info(
				"Validation and Save successfully performed for the request."
			);
		} else {
			logger.info(
				"Validation failed for the request. No matching payload found."
			);
		}
		next();
	} catch (error) {
		logger.error("Error in ValidateAndSaveIncoming middleware", {}, error);
		res.status(500).send({
			error: "Internal Server Error",
			message: "An error occurred while processing your request.",
		});
	}
}
