import { ApiRequest } from "../routes/manual";
import { NextFunction, Response } from "express";
import logger from "@ondc/automation-logger";
import {
	SessionCacheService,
	TransactionCacheService,
} from "../services/cache-services";
import { computeSubscriber, fetchFlow } from "../utils/flow-utils/main";
import {
	getFlowCompleteStatus,
	getNextActionMetaData,
} from "../services/flow-mapping-service";
import {
	loadMockSessionData,
	saveCompleteData,
} from "../services/data-services";
import {
	sendToApiService,
	sendToApiServiceAboutForm,
} from "../utils/request-utils";
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

import {
	generateMockResponse,
	getMockActionObject,
} from "../config/mock-config";
import { saveDataForConfig } from "../services/data-services";
import { getLoggerData } from "../utils/logger";
import { TransactionCache } from "../types/transaction-cache";

export async function setFlowAndTransactionId(
	req: ApiRequest,
	res: Response,
	next: NextFunction
) {
	try {
		logger.info(
			"Setting flow and transaction ID for new mock request",
			getLoggerData(req)
		);
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
					transactionService.createTransactionKey(transactionId, subscriberUrl),
				getLoggerData(req)
			);
			throw new Error(
				"Flow ID not found for " +
					transactionService.createTransactionKey(transactionId, subscriberUrl)
			);
		}
		if (!transactionData || !transactionData.sessionId) {
			logger.error(
				"Transaction data not found for " +
					transactionService.createTransactionKey(transactionId, subscriberUrl),
				getLoggerData(req)
			);
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
		logger.info(
			`✅ Flow fetched successfully for ${transactionService.createTransactionKey(
				transactionId,
				subscriberUrl
			)} ${flowId}`,
			getLoggerData(req)
		);
		next();
	} catch (err: any) {
		logger.error(
			`Error in setting request meta data for ${req.body.context.transaction_id}`,
			getLoggerData(req),
			err
		);
		res.status(500).send("Internal Server Error");
	}
}

export async function startNewFLow(
	req: ApiRequest,
	res: Response,
	next: NextFunction
) {
	try {
		logger.info("New flow request received", getLoggerData(req));
		const transactionId = uuidv4();
		const sessionId = req.body.session_id;
		const flowId = req.body.flow_id;
		if (!transactionId || !sessionId || !flowId) {
			logger.error(
				"transaction_id, session_id or flow_id not found in request body",
				getLoggerData(req)
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
		logger.info(
			`✅ preparation for new flow completed for transactionId: ${transactionId} sessionId: ${sessionId}
		flowId: ${flowId}`,
			getLoggerData(req)
		);
		next();
	} catch (err) {
		logger.error("Error in new flow request", getLoggerData(req), err);
		res.status(500).send("Error in new flow request");
	}
}

export async function proceedWithFlow(
	req: ApiRequest,
	res: Response,
	next: NextFunction
) {
	try {
		logger.info("Proceeding with flow", getLoggerData(req));

		const transactionId = req.body.transaction_id;
		const sessionId = req.body.session_id;
		if (!transactionId || !sessionId) {
			logger.error(
				"transaction_id or session_id not found in request body",
				getLoggerData(req)
			);
			res
				.status(400)
				.send("transaction_id or session_id not found in request body");
			return;
		}
		const { transactionData, sessionData, flow } = await getFlowInfo(
			transactionId,
			sessionId,
			getLoggerData(req)
		);
		req.transactionData = transactionData;
		req.flow = flow;
		req.subscriberUrl = sessionData.subscriberUrl;
		req.transactionId = transactionId;
		req.apiSessionCache = sessionData;
		logger.info(
			`✅ Flow and transaction data loaded for transactionId: ${transactionId} sessionId: ${sessionId}`,
			getLoggerData(req)
		);
		next();
	} catch (err) {
		logger.error("Error in proceeding flow", getLoggerData(req), err);
		res.status(500).send("Error in proceeding flow");
	}
}

export async function getFlowStatus(req: ApiRequest, res: Response) {
	try {
		const transactionId = req.query.transaction_id as string;
		const sessionId = req.query.session_id as string;
		logger.info(
			`Getting Current flow status for transactionId: ${transactionId} sessionId: ${sessionId}`,
			getLoggerData(req)
		);
		const { transactionData, sessionData, flow } = await getFlowInfo(
			transactionId,
			sessionId,
			getLoggerData(req)
		);
		const mockSessionData = await loadMockSessionData(
			transactionId,
			sessionData.subscriberUrl
		);
		const flowStatus = await getFlowStatusService(
			transactionId,
			sessionData.subscriberUrl,
			getLoggerData(req)
		);
		res
			.status(200)
			.send(
				getFlowCompleteStatus(
					transactionData,
					flow,
					flowStatus.status,
					mockSessionData
				)
			);
	} catch (err) {
		logger.error("Error in fetching flow status", getLoggerData(req), err);
		res.status(500).send("Error in fetching flow status");
	}
}

export async function ActUponFlow(req: ApiRequest, res: Response) {
	const txData = req.transactionData;
	const subscriberUrl = req.subscriberUrl;
	const txId = req.transactionId;
	try {
		logger.info("Acting upon flow", getLoggerData(req));
		const flow = req.flow;
		if (!flow || !txData || !subscriberUrl || !txId) {
			logger.error(
				"[FATAL] Flow or Transaction data not found <INTERNAL-ERROR>",
				getLoggerData(req)
			);
			res
				.status(500)
				.send("<INTERNAL-ERROR> Flow or Transaction data not found");
			return;
		}

		const flowStatus = await getFlowStatusService(
			txId,
			subscriberUrl,
			getLoggerData(req)
		);
		if (flowStatus.status === "SUSPENDED") {
			logger.info("Flow is suspended, not proceeding", getLoggerData(req));
			res.status(200).send({ message: "Flow is suspended, not proceeding" });
			return;
		}
		if (flowStatus.status === "WORKING") {
			logger.info(
				"Flow is already in progress, not proceeding",
				getLoggerData(req)
			);
			res.status(200).send({
				message: "a flow response is already in progress, wait and try again!",
			});
			return;
		}
		const mockSessionData = await loadMockSessionData(txId, subscriberUrl);
		const latestMeta = getNextActionMetaData(
			txData,
			flow,
			flowStatus.status,
			mockSessionData
		);
		console.log("latestMeta", latestMeta);
		if (!latestMeta) {
			logger.info("Mock response is not required", getLoggerData(req));
			res.status(200).send("Mock response is not required flow is complete");
			return;
		}

		if (latestMeta.status === "INPUT-REQUIRED" && !req.body.json_path_changes) {
			const input = latestMeta.input;
			logger.info(
				`User Input required for ${latestMeta.actionId}`,
				getLoggerData(req),
				{
					meta: latestMeta,
				}
			);
			res.status(200).send({
				message:
					"Input required, pass the inputs under key json_path_changes in body and send again",
				inputs: input,
			});
			return;
		}

		if (
			latestMeta.status === "RESPONDING" ||
			latestMeta.status === "INPUT-REQUIRED" ||
			latestMeta.status === "WAITING-SUBMISSION"
		) {
			res.status(200).send("Mock service is now responding");
			logger.info(
				`⏳ Mock service is now responding with ${latestMeta.actionId} as ${latestMeta.owner}`,
				getLoggerData(req),
				{
					meta: latestMeta,
				}
			);

			if (latestMeta.actionType === "HTML_FORM") {
				console.log("HTML_FORM action detected", req.body);
				await setFlowStatusService(txId, subscriberUrl, "WORKING");
				const version = req.apiSessionCache?.version;
				if (!version) {
					throw new Error("Version not found in session data");
				}
				if (!req.body.inputs || !req.body.inputs.submission_id) {
					throw new Error("submission_id not found in inputs");
				}
				const mockHtmlAction = await getMockActionObject(
					latestMeta.actionId,
					txData.sessionId
				);
				const saveData = mockHtmlAction.saveData;
				const sessionData = await loadMockSessionData(txId, subscriberUrl);
				const saveDataObj = saveData?.["save-data"];
				if (!saveDataObj || typeof saveDataObj !== "object") {
					throw new Error(
						"[FATAL] Invalid or missing save-data for HTML_FORM action " +
							latestMeta.actionId
					);
				}
				const firstKey = Object.keys(saveDataObj)[0];
				if (!firstKey) {
					throw new Error(
						"[FATAL] No save data key found for HTML_FORM action: " +
							latestMeta.actionId
					);
				}
				sessionData[firstKey as keyof typeof sessionData] =
					req.body.inputs.submission_id;
				await saveCompleteData(JSON.stringify(sessionData), txId);
				await sendToApiServiceAboutForm(
					subscriberUrl,
					txId,
					latestMeta.actionId,
					"HTML_FORM",
					version,
					req.body.inputs.submission_id
				);
				return;
			}
			await setFlowStatusService(txId, subscriberUrl, "WORKING");
			let sessionData: any = await GetMockSessionDataForGeneration(
				{},
				txId,
				subscriberUrl,
				txData
			);
			// const repeatTimes = sessionData.REPEAT_NEXT_API ?? latestMeta.repeat ?? 1;
			for (let i = 0; i < 1; i++) {
				// sessionData = await GetMockSessionDataForGeneration(
				// 	sessionData,
				// 	txId,
				// 	subscriberUrl,
				// 	txData
				// );
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

				const mockActionOb = await getMockActionObject(
					latestMeta.actionId,
					txData.sessionId
				);
				const saveData = mockActionOb.saveData;
				const playground = req.apiSessionCache?.usecaseId === "PLAYGROUND-FLOW";
				await saveDataForConfig(saveData, mockResponse, undefined, playground);

				await sendToApiService(action, mockResponse, {
					subscriber_url: subscriberUrl,
					flow_id: flow.id,
					session_id: txData.sessionId,
				});
				logger.info(
					`Mock response sent for ${latestMeta.actionId} as ${latestMeta.owner}`,
					getLoggerData(req),
					{ meta: latestMeta, mockResponse }
				);
			}
			return;
		} else if (latestMeta.status === "LISTENING") {
			if (latestMeta.expect && txData.sessionId) {
				await createExpectationService(
					subscriberUrl,
					flow.id,
					txData.sessionId,
					latestMeta.actionType,
					getLoggerData(req)
				);
			}
			logger.info(
				`Mock service is now listening for ${latestMeta.actionId}`,
				getLoggerData(req),
				{
					meta: latestMeta,
				}
			);
			res.status(200).send("Listening for next action");
			return;
		}
		logger.info("No actionable state found in flow!", getLoggerData(req));
		res.status(200).send(setAckResponse(true));
		return;
	} catch (e) {
		logger.error("Error in Progressing flow", getLoggerData(req), e);
		await deleteFlowStatusService(txId, subscriberUrl);
		if (!res.headersSent) {
			res.status(500).send("Error in ActUponFlow");
		}
		return;
	}
}
async function GetMockSessionDataForGeneration(
	sessionData: any,
	txId: string,
	subscriberUrl: string,
	txData: TransactionCache
) {
	sessionData = await loadMockSessionData(txId, subscriberUrl);
	// Inject flow_id and session_id into sessionData
	sessionData.flow_id = txData.flowId;
	sessionData.session_id = txData.sessionId;
	sessionData.domain = process.env.DOMAIN?.split(":")[1];
	sessionData.transaction_id = txId;
	return sessionData;
}
