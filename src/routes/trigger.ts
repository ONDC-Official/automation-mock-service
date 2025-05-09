import { Router, Request } from "express";

import {
	generateMockResponseMiddleware,
	replaceJsonPaths,
} from "../controllers/generationController";

import { logError, logger, logInfo } from "../utils/logger";
import { sendToApiService } from "../utils/request-utils";
import { setAckResponse } from "../utils/ackUtils";
import { getSafeActions } from "../services/mock-services";
import { RedisService } from "ondc-automation-cache-lib";
import { SessionCache } from "../types/api-session-cache";
import otelTracing from "../middlewares/tracing";

const triggerRouter = Router();

interface QuerySettings {
	transaction_id: string;
	action_id: string;
	version: string;
	subscriber_url?: string;
	session_id : string;
	[key: string]: undefined | string | string[] | any;
}
export interface TriggerRequest extends Request {
	mockResponse?: any;
	queryData?: QuerySettings;
}

export interface BodyTriggerType {
	payload?: any;
	json_path_changes?: Record<string, any>;
}

triggerRouter.post(
	"/api-service/:action",
	otelTracing(
		'query.transaction_id',
		'query.session_id',
		'query.bap_id',
		'query.bpp_id'
	),
	generateMockResponseMiddleware,
	replaceJsonPaths,
	async (req: TriggerRequest, res) => {
		try {
			logInfo({
				message: "Entering trigger route",
				meta: {
					action: req.params.action,
					transaction_id: req.query.transaction_id,
					subscriber_url: req.query.subscriber_url,
				},
				transaction_id: req.query.transaction_id as string,
			});
			if (!req.mockResponse) {
				logInfo({
					message: "Mock response not found",
					meta: {
						action: req.params.action,
						transaction_id: req.query.transaction_id,
						subscriber_url: req.query.subscriber_url,
					},
					transaction_id: req.query.transaction_id as string,
				});
				throw new Error("Mock response not found");
			}
			const action = req.params.action;
			await sendToApiService(action, req.mockResponse, req.queryData);
			logInfo({
				message: "Exiting trigger route",
				meta: {
					action: req.params.action,
					transaction_id: req.query.transaction_id,
					subscriber_url: req.query.subscriber_url,
				},
				transaction_id: req.query.transaction_id as string,
			});
			res.status(200).send(setAckResponse(true));
		} catch (err) {
			// logger.error("Error in forwarding request to API service", err);
			logError({
				message: "Error in forwarding request to API service",
				meta: {
					action: req.params.action,
					transaction_id: req.query.transaction_id,
					subscriber_url: req.query.subscriber_url,
				},
				transaction_id: req.query.transaction_id as string,
				error: err,
			});
			res.status(500).send("Error in forwarding request to API service");
		}
	}
);

triggerRouter.get("/safe-actions",
	otelTracing(
		'query.transaction_id',
		'query.session_id',
		'query.bap_id',
		'query.bpp_id'
	), async (req, res) => {
	const transaction_id = req.query.transaction_id as string;
	const mockType = req.query.mock_type as string;
	if (!transaction_id) {
		logInfo({
			message: " Exiting trigger / safe actions route. Transaction ID not found",
			});
		res.status(400).send("Transaction ID not found in query data");
		return;
	}

	if (!mockType) {
		logInfo({
			message: " Exiting trigger / safe actions route. Mock type not found",
			});
		res.status(400).send("Mock type not found in query data");
		return;
	}
	RedisService.useDb(0)
  const api_session =
	(await RedisService.getKey(req.query.session_id as string)) ?? "";
	// console.log("api_session is ", api_session, "session_id is ",req.query.session_id)
	logInfo({
		message: "api_session is " + api_session + "session_id is " + req.query.session_id
	});

  const data = JSON.parse(api_session) as SessionCache;

  const { usecaseId } = data;
	const safeActions = await getSafeActions(transaction_id, data.subscriberUrl, mockType,usecaseId);
	// logger.info(`Returning safe actions ${JSON.stringify(safeActions)}`);
	logInfo({
		message: `Exiting trigger / safe actions route. Returning safe actions ${JSON.stringify(
			safeActions
		)}`,
		meta: {
			transaction_id: req.query.transaction_id,
			subscriber_url: req.query.subscriber_url,
		},
		transaction_id: req.query.transaction_id as string,
	});
	res.status(200).send(safeActions);
});

triggerRouter.get(
	"/payload/:action",
	generateMockResponseMiddleware,
	(req: TriggerRequest, res) => {
		logInfo({
			message: "Entering trigger / payload route",
			meta: {
				action: req.params.action,
				transaction_id: req.query.transaction_id,
				subscriber_url: req.query.subscriber_url,
			},
			transaction_id: req.query.transaction_id as string,
		});
		if (!req.mockResponse) {
			// logger.error("Mock response not found");
			logInfo({
				message: "Exiting trigger / payload route. Mock response not found",
				meta: {
					action: req.params.action,
					transaction_id: req.query.transaction_id,
					subscriber_url: req.query.subscriber_url,
				},
				transaction_id: req.query.transaction_id as string,
			});
			res.status(404).send("Mock response not found");
		}
		// logger.info("Returning mock response");
		logInfo({
			message: "Exiting trigger / payload route. Returning mock response",
			meta: {
				action: req.params.action,
				transaction_id: req.query.transaction_id,
				subscriber_url: req.query.subscriber_url,
			},
			transaction_id: req.query.transaction_id as string,
		});
		res.status(200).send(req.mockResponse);
	}
);

export default triggerRouter;
