import { Request, Response } from "express";
import {
	createExpectationService,
	deleteExpectationService,
} from "../services/api-expectation-service";
import logger from "@ondc/automation-logger";
import { getLoggerData } from "../utils/loggerUtils";

export const createExpectation = async (req: Request, res: Response) => {
	try {
		const sessionId = req.query.session_id as string;
		const flowId = req.query.flow_id as string;
		const expectedAction = req.query.expected_action as string;
		const subUrl = req.query.subscriber_url as string;

		await createExpectationService(
			subUrl,
			flowId,
			sessionId,
			expectedAction,
			getLoggerData(req)
		);
		logger.info(
			`Expectation created for sessionId: ${sessionId}, flowId: ${flowId}, action: ${expectedAction}`,
			getLoggerData(req)
		);
		res.status(201).send({ message: "Expectation created" });
	} catch (e) {
		logger.error("Error creating expectation", getLoggerData(req), e);
		res.status(500).send({ message: "Error creating expectation" });
	}
};

export const deleteExpectation = async (req: Request, res: Response) => {
	try {
		const sessionId = req.query.session_id as string;
		const subscriberUrl = req.query.subscriber_url as string;
		await deleteExpectationService(sessionId, subscriberUrl);
		logger.info(
			`Expectation deleted for sessionId: ${sessionId}, subscriberUrl: ${subscriberUrl}`,
			getLoggerData(req)
		);
		res.status(200).send({ message: "Expectation deleted" });
	} catch (e) {
		logger.error("Error deleting expectation", getLoggerData(req), e);
		res.status(500).send({ message: "Error deleting expectation" });
	}
};
