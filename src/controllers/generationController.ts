import { NextFunction, Request, Response } from "express";
import { TriggerRequest } from "../routes/trigger";
import { loadMockSessionData } from "../services/data-services";
import logger from "@ondc/automation-logger";
import { updateAllJsonPaths } from "../utils/json-editor-utils/jsonPathEditor";
import { delay } from "../utils/generic-utils";
import { generateMockResponse } from "../config/mock-config";
import { getLoggerData } from "../utils/logger-utils";

export async function generateMockResponseMiddleware(
	req: TriggerRequest,
	res: Response,
	next: NextFunction
) {
	await delay(500);
	req.queryData = req.query as any;
	if (req.body.payload) {
		req.mockResponse = req.body.payload;
		logger.info("Mock response payload received", getLoggerData(req));
		next();
	} else {
		const txn = req.queryData?.transaction_id;
		if (!txn) {
			logger.warning(
				"Transaction ID not found in query data",
				getLoggerData(req)
			);
			res.status(400).send("Transaction ID not found in query data");
			return;
		}
		if (!req.queryData?.action_id) {
			logger.warning("Action ID not found in query data", getLoggerData(req));
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
			req.body.input
		);
		req.mockResponse = mockResponse;
		logger.info("Mock response generated", getLoggerData(req));
		next();
	}
}

export async function replaceJsonPaths(
	req: TriggerRequest,
	res: Response,
	next: NextFunction
) {
	if (!req.body.json_path_changes) {
		logger.info(
			"No json_path_changes in request body, skipping json path replacement",
			getLoggerData(req)
		);
		next();
		return;
	}
	try {
		const payload = req.mockResponse;
		if (payload.error) {
			logger.info(
				"Error in response, skipping json path replacement",
				getLoggerData(req)
			);
			next();
		}
		const changes = req.body.json_path_changes;
		req.mockResponse = updateAllJsonPaths(payload, changes);
		logger.info("Json paths replaced successfully", getLoggerData(req));
		next();
	} catch (e) {
		logger.error("Error in replacing json paths", getLoggerData(req), e);
		res.status(500).send("Error in replacing json paths");
	}
}
