import { ApiRequest } from "../routes/manual";
import { NextFunction, Response } from "express";
import { logError, logger, logInfo } from "../utils/logger";
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
		// logger.info("Setting flow and transaction ID for incomming mock request");
		logInfo({
			message:
				"Entering setFlowAndTransactionId Middleware Function. Setting flow and transaction ID for incomming mock request",
			meta: { action: req.params.action },
			transaction_id: req.body.context.transaction_id,
		});
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
			// logger.error(
			// 	"Flow ID not found for " +
			// 		transactionService.createTransactionKey(transactionId, subscriberUrl)
			// );
			logInfo({
				message: `Exiting setFlowAndTransactionId Middleware Function. Flow ID not found for transactionId: ${transactionId} and subscriberUrl: ${subscriberUrl}`,
				meta: { action: req.params.action },
				transaction_id: req.body.context.transaction_id,
			});
			throw new Error(
				"Flow ID not found for " +
					transactionService.createTransactionKey(transactionId, subscriberUrl)
			);
		}
		if (!transactionData || !transactionData.sessionId) {
			// logger.error(
			// 	"Transaction data not found for " +
			// 		transactionService.createTransactionKey(transactionId, subscriberUrl)
			// );
			logInfo({
				message: `Exiting setFlowAndTransactionId Middleware Function. Transaction data not found for transactionId: ${transactionId} and subscriberUrl: ${subscriberUrl}`,
				meta: { action: req.params.action },
				transaction_id: req.body.context.transaction_id,
			});
			throw new Error(
				"Transaction data not found for " +
					transactionService.createTransactionKey(transactionId, subscriberUrl)
			);
		}

		const sessionData = await new SessionCacheService().loadSessionThatExists(
			transactionData.sessionId
		);

		const flow = await fetchFlow(sessionData, flowId);
		req.flow = flow;
		req.transactionData = transactionData;
		req.subscriberUrl = subscriberUrl;
		req.transactionId = req.body.context.transaction_id;
		req.apiSessionCache = sessionData;
		// logger.info(
		// 	`✅ Flow fetched successfully for ${transactionService.createTransactionKey(
		// 		transactionId,
		// 		subscriberUrl
		// 	)} ${flowId}`
		// );
		logInfo({
			message: `Exiting setFlowAndTransactionId Middleware Function. Flow fetched successfully for transactionId: ${transactionId} and subscriberUrl: ${subscriberUrl}`,
			meta: { action: req.params.action, flowId },
			transaction_id: req.body.context.transaction_id,
		});
		next();
	} catch (err: any) {
		// logger.error("Error in setFlowAndTransactionId", err);
		logError({
			message: `Error in setFlowAndTransactionId Middleware Function.`,
			meta: { action: req.params.action },
			transaction_id: req.body.context.transaction_id,
			error: err,
		});
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
		// logger.info("New flow request received");
		logInfo({
			message:
				"Entering startNewFLow Middleware Function. New flow request received",
			meta: { action: req.params.action },
		});
		const transactionId = uuidv4();
		const sessionId = req.body.session_id;
		const flowId = req.body.flow_id;
		if (!transactionId || !sessionId || !flowId) {
			// logger.error(
			// 	"transaction_id, session_id or flow_id not found in request body"
			// );
			logInfo({
				message:
					"Exiting startNewFLow Middleware Function. transaction_id, session_id or flow_id not found in request body",
				meta: { action: req.params.action },
			});
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
		const flow = await fetchFlow(sessionData, flowId);

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
		// logger.info(`preparation for new flow completed for transactionId: ${transactionId} sessionId: ${sessionId}
		// flowId: ${flowId}`);
		logInfo({
			message: `Exiting startNewFLow Middleware Function. Preparation for new flow completed for transactionId: ${transactionId} sessionId: ${sessionId} flowId: ${flowId}`,
			meta: { action: req.params.action },
		});
		next();
	} catch (err) {
		// logger.error("Error in new flow request", err);
		logError({
			message: "Error in new flow request",
			meta: { action: req.params.action },
			error: err,
		});
		res.status(500).send("Error in new flow request");
	}
}

export async function proceedWithFlow(
	req: ApiRequest,
	res: Response,
	next: NextFunction
) {
	try {
		logInfo({
			message: "Entering proceedWithFlow Middleware Function",
			meta: { action: req.params.action },
			transaction_id: req.body.transaction_id,
		});
		const transactionId = req.body.transaction_id;
		const sessionId = req.body.session_id;
		if (!transactionId || !sessionId) {
			// logger.error("transaction_id or session_id not found in request body");
			logInfo({
				message:
					"Exiting proceedWithFlow Middleware Function. transaction_id or session_id not found in request body",
				meta: { action: req.params.action },
			});
			res
				.status(400)
				.send("transaction_id or session_id not found in request body");
			return;
		}
		// logger.info(
		// 	`proceeding flow for transactionId: ${transactionId} sessionId: ${sessionId}`
		// );
		logInfo({
			message: `Proceeding flow for transactionId: ${transactionId} sessionId: ${sessionId}`,
			meta: { action: req.params.action },
		});
		const { transactionData, sessionData, flow } = await getFlowInfo(
			transactionId,
			sessionId
		);
		req.transactionData = transactionData;
		req.flow = flow;
		req.subscriberUrl = sessionData.subscriberUrl;
		req.transactionId = transactionId;
		req.apiSessionCache = sessionData;
		logInfo({
			message: "Exiting proceedWithFlow Middleware Function",
			meta: { action: req.params.action },
			transaction_id: req.body.transaction_id,
		});

		next();
	} catch (err) {
		// logger.error("Error in proceeding flow", err);
		logError({
			message: "Error in proceeding flow",
			meta: { action: req.params.action },
			transaction_id: req.body.transaction_id,
			error: err,
		});
		res.status(500).send("Error in proceeding flow");
	}
}

export async function getFlowStatus(req: ApiRequest, res: Response) {
	logInfo({
		message: "Entering getFlowStatus Middleware Function",
		meta: { action: req.params.action },
		transaction_id: req.query.transaction_id as string,
	});
	try {
		const transactionId = req.query.transaction_id as string;
		const sessionId = req.query.session_id as string;
		// logger.info(
		// 	`Fetching flow status for transactionId: ${transactionId} sessionId: ${sessionId}`
		// );
		logInfo({
			message: `Fetching flow status for transactionId: ${transactionId} sessionId: ${sessionId}`,
			meta: { action: req.params.action },
		});
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
		logInfo({
			message: "Exiting getFlowStatus Middleware Function",
			meta: { action: req.params.action, flow, flowStatus: flowStatus.status },
			transaction_id: req.query.transaction_id as string,
		});
	} catch (err) {
		// logger.error("Error in fetching flow status", err);
		logError({
			message: "Error in fetching flow status",
			meta: { action: req.params.action },
			transaction_id: req.query.transaction_id as string,
			error: err,
		});

		res.status(500).send("Error in fetching flow status");
	}
}

export async function ActUponFlow(req: ApiRequest, res: Response) {
	const txData = req.transactionData;
	const subscriberUrl = req.subscriberUrl;
	const txId = req.transactionId;
	try {
		// logger.info("Acting upon flow");
		logInfo({
			message: "Entering ActUponFlow Function. Acting upon flow",
			meta: {
				action: req.params.action,
				transactionId: txId,
				subscriberUrl: subscriberUrl,
				transactionData: txData,
			},
			transaction_id: txId,
		});
		const flow = req.flow;
		if (!flow || !txData || !subscriberUrl || !txId) {
			// logger.error("Flow or Transaction data not found <INTERNAL-ERROR>");
			logInfo({
				message:
					"Exiting ActUponFlow Function. Flow or Transaction data not found <INTERNAL-ERROR>",
				meta: {
					action: req.params.action,
					transactionId: txId,
					subscriberUrl: subscriberUrl,
					transactionData: txData,
				},
				transaction_id: txId,
			});
			res
				.status(500)
				.send("<INTERNAL-ERROR> Flow or Transaction data not found");
			return;
		}

		const flowStatus = await getFlowStatusService(txId, subscriberUrl);
		if (flowStatus.status === "SUSPENDED") {
			// logger.info("Flow is suspended, not proceeding");
			logInfo({
				message:
					"Exiting ActUponFlow Function. Flow is suspended, not proceeding",
				meta: {
					action: req.params.action,
					transactionId: txId,
					subscriberUrl: subscriberUrl,
					transactionData: txData,
				},
				transaction_id: txId,
			});
			res.status(200).send({ message: "Flow is suspended, not proceeding" });
			return;
		}
		if (flowStatus.status === "WORKING") {
			// logger.info("Flow is already in progress, not proceeding");
			logInfo({
				message:
					"Exiting ActUponFlow Function. Flow is already in progress, not proceeding",
				meta: {
					action: req.params.action,
					transactionId: txId,
					subscriberUrl: subscriberUrl,
					transactionData: txData,
				},
				transaction_id: txId,
			});
			res.status(200).send({
				message: "a flow response is already in progress, wait and try again!",
			});
			return;
		}
		const latestMeta = getNextActionMetaData(txData, flow, flowStatus.status);
		if (!latestMeta) {
			// logger.info("Mock response is not required");
			logInfo({
				message: "Exiting ActUponFlow Function. Mock response is not required",
				meta: {
					action: req.params.action,
					transactionId: txId,
					subscriberUrl: subscriberUrl,
					transactionData: txData,
				},
				transaction_id: txId,
			});
			res.status(200).send("Mock response is not required flow is complete");
			return;
		}

		if (latestMeta.status === "INPUT-REQUIRED" && !req.body.json_path_changes) {
			const input = latestMeta.input;
			// logger.info("Input required");
			logInfo({
				message: "Exiting ActUponFlow Function. Input required",
				meta: {
					action: req.params.action,
					transactionId: txId,
					subscriberUrl: subscriberUrl,
					transactionData: txData,
				},
				transaction_id: txId,
			});
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
			// logger.info("Mock service is now responding");
			logInfo({
				message: "Mock service is now responding",
				meta: {
					action: req.params.action,
					transactionId: txId,
					subscriberUrl: subscriberUrl,
					transactionData: txData,
				},
				transaction_id: txId,
			});
			const sessionData = await loadMockSessionData(txId, subscriberUrl);
			let mockResponse = await generateMockResponse(
				txData.sessionId as string,
				sessionData,
				latestMeta.actionId,
				req.body.inputs
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
			logInfo({
				message: "Exiting ActUponFlow Function.",
				meta: {
					action: req.params.action,
					transactionId: txId,
					subscriberUrl: subscriberUrl,
					transactionData: txData,
				},
				transaction_id: txId,
			});
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
			// logger.info("Mock service is now listening");
			logInfo({
				message: "Exiting ActUponFlow Function. Mock service is now listening",
				meta: {
					action: req.params.action,
					transactionId: txId,
					subscriberUrl: subscriberUrl,
					transactionData: txData,
				},
				transaction_id: txId,
			});
			res.status(200).send({
				message: "Mock service is now listening",
				expectationAdded: expecAdded,
				metaData: latestMeta,
			});
			return;
		}
		// logger.info("No actionable state found in flow!");
		logInfo({
			message:
				"Exiting ActUponFlow Function. No actionable state found in flow!",
			meta: {
				action: req.params.action,
				transactionId: txId,
				subscriberUrl: subscriberUrl,
				transactionData: txData,
			},
			transaction_id: txId,
		});
		res.status(200).send(setAckResponse(true));
		return;
	} catch (e) {
		// logger.error("Error in ActUponFlow", e);
		logError({
			message: "Error in ActUponFlow",
			meta: {
				action: req.params.action,
				transactionId: req.body.transaction_id,
				subscriberUrl: req.body.subscriber_url,
				transactionData: req.transactionData,
			},
			transaction_id: req.body.transaction_id,
			error: e,
		});
		await deleteFlowStatusService(txId, subscriberUrl);
		res.status(500).send("Error in ActUponFlow");
		return;
	}
}
