import { Request, Response } from "express";
import {
	createExpectationService,
	deleteExpectationService,
} from "../services/api-expectation-service";
import { logger, logInfo, logError } from "../utils/logger";

export const createExpectation = async (req: Request, res: Response) => {
	logInfo({
		message: "Entering createExpectation Function.",
		meta: {
			sessionId: req.query.session_id,
			flowId: req.query.flow_id,
			expectedAction: req.query.expected_action,
			subscriberUrl: req.query.subscriber_url,
		},
	});
	try {
		const sessionId = req.query.session_id as string;
		const flowId = req.query.flow_id as string;
		const expectedAction = req.query.expected_action as string;
		const subUrl = req.query.subscriber_url as string;

		await createExpectationService(subUrl, flowId, sessionId, expectedAction);
		logInfo({
			message: "Exiting createExpectation Function.",
			meta: {
				sessionId,
				flowId,
				expectedAction,
				subscriberUrl: subUrl,
			},
		});
		res.status(201).send({ message: "Expectation created" });
	} catch (e) {
		// logger.error("error creating expectation", e);
		logError({
			message: "Error creating expectation",
			meta: {
				sessionId: req.query.session_id,
				flowId: req.query.flow_id,
				expectedAction: req.query.expected_action,
				subscriberUrl: req.query.subscriber_url,
			},
			error: e,
		});
		res.status(500).send({ message: "Error creating expectation" });
	}
};

export const deleteExpectation = async (req: Request, res: Response) => {
		logInfo({
			message: "Entering deleteExpectation Function.",
			meta: {
				sessionId: req.query.session_id,
				subscriberUrl: req.query.subscriber_url,
			},
		});
	try {
		const sessionId = req.query.session_id as string;
		const subscriberUrl = req.query.subscriber_url as string;
		await deleteExpectationService(sessionId, subscriberUrl);
		logInfo({
			message: "Exiting deleteExpectation Function.",
			meta: {	
				sessionId,
				subscriberUrl,
			},
		});
		res.status(200).send({ message: "Expectation deleted" });
	} catch (e) {
		// logger.error("error deleting expectation", e);
		logError({
			message: "Error deleting expectation",
			meta: {
				sessionId: req.query.session_id,
				subscriberUrl: req.query.subscriber_url,
			},
			error: e,
		});
		res.status(500).send({ message: "Error deleting expectation" });
	}
};
