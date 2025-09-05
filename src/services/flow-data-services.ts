import { fetchFlow } from "../utils/flow-utils/main";
import { logger, logInfo } from "../utils/logger";
import { SessionCacheService, TransactionCacheService } from "./cache-services";

export async function getFlowInfo(transactionId: string, sessionId: string) {
	logInfo({
		message: "Entering getFlowInfo Function.",
		meta: {
			transactionId,
			sessionId,
		},
		transaction_id: transactionId,
	});

	const sessionData = await new SessionCacheService().loadSessionThatExists(
		sessionId
	);
	const subscriberUrl = sessionData.subscriberUrl;
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
			message: `Exiting getFlowInfo Function. Flow ID not found for transactionId : ${transactionId} and subscriberUrl : ${subscriberUrl}`,
			meta: {
				transactionId,
				sessionId,
				subscriberUrl,
			},
			transaction_id: transactionId,
		});
		throw new Error(
			"Flow ID not found for " +
				transactionService.createTransactionKey(transactionId, subscriberUrl)
		);
	}
	if (!transactionData) {
		logInfo({
			message: `Exiting getFlowInfo Function. Transaction Data not found for transactionId : ${transactionId} and subscriberUrl : ${subscriberUrl}`,
			meta: {
				transactionId,
				sessionId,
				subscriberUrl,
			},
			transaction_id: transactionId,
		});
		throw new Error(
			"Transaction data not found for " +
				transactionService.createTransactionKey(transactionId, subscriberUrl)
		);
	}
	if (!transactionData.sessionId) {
		logInfo({
			message: `Exiting getFlowInfo Function. Transaction Data not found for transactionId : ${transactionId} and subscriberUrl : ${subscriberUrl}`,
			meta: {
				transactionId,
				sessionId,
				subscriberUrl,
			},
			transaction_id: transactionId,
		});
		throw new Error(
			"Session ID not found for " +
				transactionService.createTransactionKey(transactionId, subscriberUrl)
		);
	}

	const flow = await fetchFlow(sessionData, flowId);
	logInfo({
		message: `Exiting getFlowInfo Function. Flow ID found for transactionId : ${transactionId} and subscriberUrl : ${subscriberUrl}`,
		meta: {
			transactionId,
			sessionId,
			subscriberUrl,
			flowId,
			flow,
		},
		transaction_id: transactionId,
	});
	return {
		transactionData,
		sessionData,
		flow,
	};
}
