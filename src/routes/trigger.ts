import { Router, Request } from "express";

import {
	generateMockResponseMiddleware,
	replaceJsonPaths,
} from "../controllers/generationController";

import { logInfo, logError } from "../utils/logger";
import { sendToApiService } from "../utils/request-utils";
import { setAckResponse } from "../utils/ackUtils";
import { getSafeActions } from "../services/mock-services";
import { RedisService } from "ondc-automation-cache-lib";
import { SessionCache } from "../types/api-session-cache";

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
	generateMockResponseMiddleware,
	replaceJsonPaths,
	async (req: TriggerRequest, res) => {
		try {
			logInfo({
				message: "Entering trigger /api-service/:action route",
				transaction_id: req.queryData?.transaction_id,
				meta: {
					action: req.params.action
				}
			})
			if (!req.mockResponse) {
				logError({
					message: "Error in /api-service/:action route",
					error: new Error("Mock response not found"),
					transaction_id: req.queryData?.transaction_id,
					meta: {
						action: req.params.action
					}
				});
				throw new Error("Mock response not found");
			}
			const action = req.params.action;
			await sendToApiService(action, req.mockResponse, req.queryData);
			logInfo({
				message: "Exiting /api-service/:action route",
				transaction_id: req.queryData?.transaction_id,
				meta: {
					action: req.params.action
				}
			})
			res.status(200).send(setAckResponse(true));
		} catch (err) {
			// logger.error("Error in forwarding request to API service", err);
			logError({
				message: "Error in forwarding request to API service",
				error: err,
				transaction_id: req.queryData?.transaction_id,
				meta: {
					action: req.params.action
				}
			});
			res.status(500).send("Error in forwarding request to API service");
		}
	}
);

triggerRouter.get("/safe-actions", async (req, res) => {

	logInfo({
		message: "Entering trigger /safe-actions route",
		transaction_id: req.query?.transaction_id as string,
	});
	const transaction_id = req.query.transaction_id as string;
	const mockType = req.query.mock_type as string;
	if (!transaction_id) {
		logError({
			message: "Transaction ID not found in query data",
		});
		res.status(400).send("Transaction ID not found in query data");
		return;
	}

	if (!mockType) {
		logError({
			message: "Mock Type not found in query data",
			transaction_id: transaction_id,
		});
		res.status(400).send("Mock type not found in query data");
		return;
	}
	RedisService.useDb(0)
  const api_session =
	(await RedisService.getKey(req.query.session_id as string)) ?? "";
	console.log("api_session is ", api_session, "session_id is ",req.query.session_id)

  const data = JSON.parse(api_session) as SessionCache;
  console.log("data is", data)

  const { usecaseId } = data;
	const safeActions = await getSafeActions(transaction_id, undefined, mockType,usecaseId);
	res.status(200).send(safeActions);
	logInfo({
		message: "Exiting /safe-actions route. Returning safe actions",
		transaction_id: transaction_id,
		meta: {
			safeActions
		}
	});
	res.status(200).send(safeActions);
});

triggerRouter.get(
	"/payload/:action",
	generateMockResponseMiddleware,
	(req: TriggerRequest, res) => {
		logInfo({
			message: "Entering trigger /payload/:action route",
			transaction_id: req.queryData?.transaction_id,
			meta: {
				action: req.params.action
			}
		})
		if (!req.mockResponse) {
			// logger.error("Mock response not found");
			logError({
				message: "Mock response not found",
				transaction_id: req.queryData?.transaction_id,
				meta: {
					action: req.params.action
				}
			});
			res.status(404).send("Mock response not found");
		}
		// logger.info("Returning mock response");
		logInfo({
			message: "Exiting /payload/:action route. Returning mock response",
			transaction_id: req.queryData?.transaction_id,
			meta: {
				action: req.params.action
			}
		})
		res.status(200).send(req.mockResponse);
	}
);

export default triggerRouter;
