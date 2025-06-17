import { NextFunction, Response } from "express";
import { ApiRequest } from "../routes/manual";
import { logError, logger } from "../utils/logger";
import { getFlowCompleteStatus } from "./flow-mapping-service";
import { getFlowStatusService } from "./mock-flow-status-service";
import { getMockActionObject } from "../config/mock-config";
import { saveDataForConfig } from "./data-services";
import { setAckResponse } from "../utils/ackUtils";
import { sendToApiService } from "../utils/request-utils";

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
			logError({
				message: "Missing required data in incoming request",
				meta: {
					transactionId: txId,
					subscriberUrl: subsUrl,
					flow: flow,
				},
			});
			res
				.status(500)
				.send("<INTERNAL-ERROR> Flow or Transaction data not found");
			return;
		}
		const flowStatus = await getFlowStatusService(txId, subsUrl);
		const flowCompleteStatus = getFlowCompleteStatus(
			txData,
			flow,
			flowStatus.status
		);
		let found = false;
		for (const step of flowCompleteStatus.sequence) {
			const data = step.payloads;
			if (data && data.payloads.length > 0) {
				const uniqueKey = `${data.action}::${data.messageId}::${data.timestamp}`;
				const requestKey = `${body.context.action}::${body.context.message_id}::${body.context.timestamp}`;
				if (uniqueKey === requestKey) {
					try {
						const mockActionOb = getMockActionObject(step.actionId);
						found = true;
						const valid = await mockActionOb.validate(body);
						if (!valid.valid) {
							logger.info(
								`Validation failed for action: ${step.actionId}, Message: ${valid.message}`
							);
							res.status(200).send(setAckResponse);

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
							return;
						}
						const saveData = mockActionOb.saveData;
						await saveDataForConfig(saveData, body);
					} catch (error) {
						logger.error(
							"Error while validating and saving " + step.actionId,
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
		logError({
			message: "Error in StateAction",
			error: error,
		});
		res.status(500).send({
			error: "Internal Server Error",
			message: "An error occurred while processing your request.",
		});
	}
}
