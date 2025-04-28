import { ApiRequest } from "../routes/manual";
import { NextFunction, Response } from "express";
import logger from "../utils/logger";
import {
	SessionCacheService,
	TransactionCacheService,
} from "../services/cache-services";
import { computeSubscriber, fetchFlow } from "../utils/flow-utils/main";
import {
	getFlowCompleteStatus,
	getNextActionMetaData,
} from "../services/flow-mapping-service";
import { loadMockSessionData } from "../services/data-services";
import { sendToApiService } from "../utils/request-utils";
import { setAckResponse } from "../utils/ackUtils";
import { updateAllJsonPaths } from "../utils/json-editor-utils/jsonPathEditor";
import { createExpectationService } from "../services/api-expectation-service";
import { v4 as uuidv4 } from "uuid";
import { getFlowInfo } from "../services/flow-data-services";
import {
	deleteFlowStatusService,
	getFlowStatusService,
	setFlowStatusService,
} from "../services/mock-flow-status-service";
import { generateMockResponse } from "../config/mock-config";

export async function setFlowAndTransactionId(
	req: ApiRequest,
	res: Response,
	next: NextFunction
) {
	try {
		logger.info("Setting flow and transaction ID for incomming mock request");
		const context = req.body.context;
		const transactionId = context.transaction_id;
		const subscriberUrl = computeSubscriber(context);

		const transactionService = new TransactionCacheService();
		const transactionData = await transactionService.tryLoadTransaction(
			transactionId,
			subscriberUrl
		);
		const flowId = transactionData?.flowId;
		if (!flowId) {
			logger.error(
				"Flow ID not found for " +
					transactionService.createTransactionKey(transactionId, subscriberUrl)
			);
			throw new Error(
				"Flow ID not found for " +
					transactionService.createTransactionKey(transactionId, subscriberUrl)
			);
		}
		if (!transactionData || !transactionData.sessionId) {
			logger.error(
				"Transaction data not found for " +
					transactionService.createTransactionKey(transactionId, subscriberUrl)
			);
			throw new Error(
				"Transaction data not found for " +
					transactionService.createTransactionKey(transactionId, subscriberUrl)
			);
		}

		const sessionData = await new SessionCacheService().loadSessionThatExists(
			transactionData.sessionId
		);

		const flow = await fetchFlow(
			context.domain,
			context.version ?? context.core_version,
			flowId,
			sessionData.usecaseId
		);
		req.flow = flow;
		req.transactionData = transactionData;
		req.subscriberUrl = subscriberUrl;
		req.transactionId = req.body.context.transaction_id;
		req.apiSessionCache = sessionData;
		logger.info(
			`✅ Flow fetched successfully for ${transactionService.createTransactionKey(
				transactionId,
				subscriberUrl
			)} ${flowId}`
		);
		next();
	} catch (err: any) {
		logger.error("Error in setFlowAndTransactionId", err);
		res
			.status(500)
			.send("Error in " + err?.message || "setFlowAndTransactionId");
	}
}

export async function startNewFLow(
	req: ApiRequest,
	res: Response,
	next: NextFunction
) {
	try {
		logger.info("New flow request received");
		const transactionId = uuidv4();
		const sessionId = req.body.session_id;
		const flowId = req.body.flow_id;
		if (!transactionId || !sessionId || !flowId) {
			logger.error(
				"transaction_id, session_id or flow_id not found in request body"
			);
			res
				.status(400)
				.send(
					"transaction_id, session_id or flow_id not found in request body"
				);
			return;
		}
		const sessionData = await new SessionCacheService().loadSessionThatExists(
			sessionId
		);
		const flow = await fetchFlow(
			sessionData.domain,
			sessionData.version,
			flowId,
			sessionData.usecaseId
		);

		req.flow = flow;
		req.transactionId = transactionId;
		req.subscriberUrl = sessionData.subscriberUrl;
		req.transactionData = {
			latestAction: "",
			latestTimestamp: "",
			type: "manual",
			subscriberType: sessionData.npType,
			flowId: flowId,
			sessionId: sessionId,
			messageIds: [],
			apiList: [],
		};
		req.apiSessionCache = sessionData;
		logger.info(`preparation for new flow completed for transactionId: ${transactionId} sessionId: ${sessionId}
		flowId: ${flowId}`);
		next();
	} catch (err) {
		logger.error("Error in new flow request", err);
		res.status(500).send("Error in new flow request");
	}
}

export async function proceedWithFlow(
	req: ApiRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const transactionId = req.body.transaction_id;
		const sessionId = req.body.session_id;
		if (!transactionId || !sessionId) {
			logger.error("transaction_id or session_id not found in request body");
			res
				.status(400)
				.send("transaction_id or session_id not found in request body");
			return;
		}
		logger.info(
			`proceeding flow for transactionId: ${transactionId} sessionId: ${sessionId}`
		);
		const { transactionData, sessionData, flow } = await getFlowInfo(
			transactionId,
			sessionId
		);
		req.transactionData = transactionData;
		req.flow = flow;
		req.subscriberUrl = sessionData.subscriberUrl;
		req.transactionId = transactionId;
		req.apiSessionCache = sessionData;
		next();
	} catch (err) {
		logger.error("Error in proceeding flow", err);
		res.status(500).send("Error in proceeding flow");
	}
}

export async function getFlowStatus(req: ApiRequest, res: Response) {
	try {
		const transactionId = req.query.transaction_id as string;
		const sessionId = req.query.session_id as string;
		logger.info(
			`Fetching flow status for transactionId: ${transactionId} sessionId: ${sessionId}`
		);
		const { transactionData, sessionData, flow } = await getFlowInfo(
			transactionId,

			sessionId
		);
		const flowStatus = await getFlowStatusService(
			transactionId,
			sessionData.subscriberUrl
		);
		res
			.status(200)
			.send(getFlowCompleteStatus(transactionData, flow, flowStatus.status));
	} catch (err) {
		logger.error("Error in fetching flow status", err);
		res.status(500).send("Error in fetching flow status");
	}
}

export async function ActUponFlow(req: ApiRequest, res: Response) {
	const txData = req.transactionData;
	const subscriberUrl = req.subscriberUrl;
	const txId = req.transactionId;
	try {
		logger.info("Acting upon flow");
		const flow = req.flow;
		if (!flow || !txData || !subscriberUrl || !txId) {
			logger.error("Flow or Transaction data not found <INTERNAL-ERROR>");
			res
				.status(500)
				.send("<INTERNAL-ERROR> Flow or Transaction data not found");
			return;
		}

		const flowStatus = await getFlowStatusService(txId, subscriberUrl);
		if (flowStatus.status === "SUSPENDED") {
			logger.info("Flow is suspended, not proceeding");
			res.status(200).send({ message: "Flow is suspended, not proceeding" });
			return;
		}
		if (flowStatus.status === "WORKING") {
			logger.info("Flow is already in progress, not proceeding");
			res.status(200).send({
				message: "a flow response is already in progress, wait and try again!",
			});
			return;
		}
		const latestMeta = getNextActionMetaData(txData, flow, flowStatus.status);
		if (!latestMeta) {
			logger.info("Mock response is not required");
			res.status(200).send("Mock response is not required flow is complete");
			return;
		}

		if (latestMeta.status === "INPUT-REQUIRED" && !req.body.json_path_changes) {
			const input = latestMeta.input;
			logger.info("Input required");
			res.status(200).send({
				message:
					"Input required, pass the inputs under key json_path_changes in body and send again",
				inputs: input,
			});
			return;
		}

		if (
			latestMeta.status === "RESPONDING" ||
			latestMeta.status === "INPUT-REQUIRED"
		) {
			res.status(200).send("Mock service is now responding");
			try {
				logger.info("Mock service is now responding");
				const sessionData = await loadMockSessionData(txId, subscriberUrl);
				let mockResponse = await generateMockResponse(
					txData.sessionId as string,
					sessionData,
					latestMeta.actionId
				);

				if (req.body.json_path_changes) {
					mockResponse = updateAllJsonPaths(
						mockResponse,
						req.body.json_path_changes
					);
				}

				const action = latestMeta.actionType;
				await setFlowStatusService(txId, subscriberUrl, "WORKING");
				await sendToApiService(action, mockResponse, {
					subscriber_url: subscriberUrl,
					flow_id: flow.id,
					session_id: txData.sessionId,
				});
			} catch (e) {
				logger.error("Error in sending mock response", e);
				return;
			}
			return;
		} else if (latestMeta.status === "LISTENING") {
			let expecAdded = false;
			if (latestMeta.expect && txData.sessionId) {
				await createExpectationService(
					subscriberUrl,
					flow.id,
					txData.sessionId,
					latestMeta.actionType
				);
				expecAdded = true;
			}
			logger.info("Mock service is now listening");
			res.status(200).send({
				message: "Mock service is now listening",
				expectationAdded: expecAdded,
				metaData: latestMeta,
			});
			return;
		}
		logger.info("No actionable state found in flow!");
		res.status(200).send(setAckResponse(true));
		return;
	} catch (e) {
		logger.error("Error in ActUponFlow", e);
		await deleteFlowStatusService(txId, subscriberUrl);
		res.status(500).send("Error in ActUponFlow");
		return;
	}
}
