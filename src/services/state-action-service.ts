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
		// Early validation of required data
		const {
			transactionData: txData,
			subscriberUrl: subsUrl,
			transactionId: txId,
			flow,
			body,
		} = req;

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

		// Load initial data
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

		// Process sequence steps
		const matchingStep = await findMatchingStep(
			flowCompleteStatus.sequence,
			body
		);

		if (!matchingStep) {
			logger.info(
				"Validation failed for the request. No matching payload found."
			);
			next();
			return;
		}

		// Process the matching step
		const processingResult = await processMatchingStep(
			matchingStep,
			flowCompleteStatus.sequence,
			body,
			mockSessionData,
			subsUrl,
			txId,
			req
		);

		// Handle response based on processing result
		if (processingResult.shouldRespond) {
			logger.info(
				"Validation and Save successfully performed for the request."
			);
			res.status(200).send(setAckResponse());
			return;
		}

		logger.info("Validation and Save successfully performed for the request.");
		next();
		return;
	} catch (error) {
		logger.error("Error in ValidateAndSaveIncoming middleware", {}, error);

		if (res.headersSent) {
			return;
		}

		res.status(500).send({
			error: "Internal Server Error",
			message: "An error occurred while processing your request.",
		});
		return;
	}
}

async function findMatchingStep(sequence: any[], body: any) {
	for (const step of sequence) {
		const data = step.payloads;

		if (!data || data.entryType === "FORM" || step.actionType === "HTML_FORM") {
			continue;
		}

		if (data && data.payloads.length > 0) {
			const uniqueKey = `${data.action}::${data.messageId}::${data.timestamp}`;
			const requestKey = `${body.context.action}::${body.context.message_id}::${body.context.timestamp}`;

			if (uniqueKey === requestKey) {
				return { step, index: sequence.indexOf(step) };
			}
		}
	}

	return null;
}

async function processMatchingStep(
	matchingStep: any,
	sequence: any[],
	body: any,
	mockSessionData: any,
	subsUrl: string,
	txId: string,
	req: ApiRequest
) {
	const { step, index } = matchingStep;

	try {
		const mockActionOb = await getMockActionObject(
			step.actionId,
			req.transactionData?.sessionId
		);

		// Validate current step
		const validationResult = (await mockActionOb.validate(
			body,
			mockSessionData
		)) as {
			valid: boolean;
			message?: string;
			code?: string;
			description?: string;
		};

		if (!validationResult.valid) {
			logger.warning(
				`Validation failed for action: ${step.actionId}, Message: ${
					validationResult.message ??
					validationResult.description ??
					"No details"
				} `,
				getLoggerData(req)
			);
			await handleValidationFailure(validationResult, step, body, subsUrl);
			return { shouldRespond: true };
		}

		// Save data for current step
		const saveData = mockActionOb.saveData;
		await saveDataForConfig(saveData, body);

		// Check for next step (HTML_FORM)
		if (index < sequence.length - 1) {
			const nextStep = sequence[index + 1];

			if (nextStep.actionType === "HTML_FORM") {
				const formProcessResult = await processFormStep(
					nextStep,
					mockSessionData,
					subsUrl,
					txId,
					req,
					mockActionOb,
					body
				);

				if (formProcessResult.shouldReturn) {
					return { shouldRespond: true };
				}
			}
		}

		return { shouldRespond: false };
	} catch (error) {
		logger.error(
			"Error while validating and saving " + step.actionId,
			{},
			error
		);
		return { shouldRespond: false };
	}
}

async function handleValidationFailure(
	validationResult: any,
	step: any,
	body: any,
	subsUrl: string
) {
	logger.info(
		`Validation failed for action: ${step.actionId}, Message: ${validationResult.message}`
	);

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
			code: validationResult.code || "VALIDATION_ERROR",
			message: validationResult.message || "Validation failed",
		},
	};

	// Add a 1-second delay
	await new Promise((resolve) => setTimeout(resolve, 1000));

	await sendToApiService(action, errBody, {
		subscriber_url: subsUrl,
		flow_id: body.flow?.id,
		session_id: body.transactionData?.sessionId,
	});
}

async function processFormStep(
	nextStep: any,
	mockSessionData: any,
	subsUrl: string,
	txId: string,
	req: ApiRequest,
	mockActionOb: any,
	body: any
) {
	logger.info("Processing HTML_FORM step", getLoggerData(req), {
		nextStep: nextStep,
	});
	const fromAction = await getMockActionObject(
		nextStep.actionId,
		req.transactionData?.sessionId
	);
	const formValidationResult = await fromAction.validate({}, mockSessionData);

	if (!formValidationResult.valid) {
		await sendToApiServiceAboutForm(
			subsUrl,
			txId,
			nextStep.actionId,
			"HTML_FORM",
			req.body.context.version ?? req.body.context.core_version,
			undefined,
			{
				code: formValidationResult.code || "FORM_VALIDATION_ERROR",
				message: formValidationResult.message || "Form Validation failed",
			}
		);

		return { shouldReturn: true };
	}

	// Save data for both current and form steps
	const saveData = mockActionOb.saveData;
	await saveDataForConfig(saveData, body);

	const saveDataForm = await fromAction.__forceSaveData(mockSessionData);
	logger.info("Saving form data", getLoggerData(req), {
		html: saveDataForm,
		txId: txId,
	});
	await saveCompleteData(JSON.stringify(saveDataForm), txId);

	return { shouldReturn: false };
}
