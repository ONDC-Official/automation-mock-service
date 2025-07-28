import { NextFunction, Request, Response } from "express";
import { TriggerRequest } from "../routes/trigger";
import { loadMockSessionData } from "../services/data-services";
import { logger, logInfo } from "../utils/logger";
import { updateAllJsonPaths } from "../utils/json-editor-utils/jsonPathEditor";
import { delay } from "../utils/generic-utils";
import { generateMockResponse } from "../config/mock-config";

export async function generateMockResponseMiddleware(
	req: TriggerRequest,
	res: Response,
	next: NextFunction
) {
	logInfo({
		message: "Entering generateMockResponseMiddleware",
		meta: {
			sessionId: req.query.session_id,
			actionId: req.query.action_id,
			subscriberUrl: req.query.subscriber_url,
		},
		transaction_id: req.query.transaction_id as string,
	});
	await delay(500);
	req.queryData = req.query as any;
	if (req.body.payload) {
		req.mockResponse = req.body.payload;
		logInfo({
			message: "Exiting generateMockResponseMiddleware.  Mock response payload received",
			meta: {
				sessionId: req.query.session_id,
				actionId: req.query.action_id,
				subscriberUrl: req.query.subscriber_url,
			},
			transaction_id: req.query.transaction_id as string,
		});
		next();
	} else {
		const txn = req.queryData?.transaction_id;
		if (!txn) {
			// logger.error("Transaction ID not found in query data");
			logInfo({
				message: "Exiting generateMockResponseMiddleware. Transaction ID not found in query data",
				meta: {
					sessionId: req.query.session_id,
					actionId: req.query.action_id,
					subscriberUrl: req.query.subscriber_url,
				},
			});
			res.status(400).send("Transaction ID not found in query data");
			return;
		}
		if (!req.queryData?.action_id) {
			// logger.error("Action ID not found in query data");
			logInfo({
				message: "Exiting generateMockResponseMiddleware. Action ID not found in query data",
				meta: {
					sessionId: req.query.session_id,
					actionId: req.query.action_id,
					subscriberUrl: req.query.subscriber_url,
				},
			});
			res.status(400).send("Action ID not found in query data");
			return;
		}
		const sessionData = await loadMockSessionData(
			txn,
			req.queryData.subscriber_url as string
		);
		const mockResponse = await generateMockResponse(
			req.queryData.session_id ?? "",
			sessionData,
			req.queryData?.action_id,
			req.body.inputs
		);
		req.mockResponse = mockResponse;
		logInfo({
			message: "Exiting generateMockResponseMiddleware. Mock response generated",
			meta: {
				sessionId: req.query.session_id,
				actionId: req.query.action_id,
				subscriberUrl: req.query.subscriber_url,
			},
			transaction_id: req.query.transaction_id as string,
		});
		next();
	}
}

export async function replaceJsonPaths(
	req: TriggerRequest,
	res: Response,
	next: NextFunction
) {
	logInfo({
		message: "Entering replaceJsonPaths",
		meta: {
			sessionId: req.query.session_id,
			actionId: req.query.action_id,
			subscriberUrl: req.query.subscriber_url,
		},
		transaction_id: req.query.transaction_id as string,
	});
	if (!req.body.json_path_changes) {
		logInfo({
			message: "Exiting replaceJsonPaths. No json_path_changes in request body",
			meta: {
				sessionId: req.query.session_id,
				actionId: req.query.action_id,
				subscriberUrl: req.query.subscriber_url,
			},
			transaction_id: req.query.transaction_id as string,
		});
		next();
		return;
	}
	try {
		const payload = req.mockResponse;
		if (payload.error) {
			// logger.info("Error in response, skipping json path replacement");
			logInfo({
				message: "Exiting replaceJsonPaths. Error in response, skipping json path replacement",
				meta: {
					sessionId: req.query.session_id,
					actionId: req.query.action_id,
					subscriberUrl: req.query.subscriber_url,
				},
				transaction_id: req.query.transaction_id as string,
			});
			next();
		}
		const changes = req.body.json_path_changes;
		req.mockResponse = updateAllJsonPaths(payload, changes);
		logInfo({
			message: "Exiting replaceJsonPaths. Json paths replaced successfully",
			meta: {
				sessionId: req.query.session_id,
				actionId: req.query.action_id,
				subscriberUrl: req.query.subscriber_url,
			},
			transaction_id: req.query.transaction_id as string,
		});	
		next();
	} catch (e) {
		// logger.error("Error in replacing json paths", e);
		logInfo({
			message: "Exiting replaceJsonPaths. Error in replacing json paths",
			meta: {
				sessionId: req.query.session_id,
				actionId: req.query.action_id,
				subscriberUrl: req.query.subscriber_url,
			},
			transaction_id: req.query.transaction_id as string,
			error: e,
		});
		res.status(500).send("Error in replacing json paths");
	}
}
