import { fetchFlow } from "../utils/flow-utils/main";
import logger from "@ondc/automation-logger";
import { SessionCacheService, TransactionCacheService } from "./cache-services";

export async function getFlowInfo(transactionId: string, sessionId: string) {
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
		throw new Error(
			"Flow ID not found for " +
				transactionService.createTransactionKey(transactionId, subscriberUrl)
		);
	}
	if (!transactionData) {
		throw new Error(
			"Transaction data not found for " +
				transactionService.createTransactionKey(transactionId, subscriberUrl)
		);
	}
	if (!transactionData.sessionId) {
		throw new Error(
			"Session ID not found for " +
				transactionService.createTransactionKey(transactionId, subscriberUrl)
		);
	}
	const flow = await fetchFlow(sessionData, flowId);
	return {
		transactionData,
		sessionData,
		flow,
	};
}
