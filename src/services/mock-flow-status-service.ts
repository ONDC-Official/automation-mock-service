import { RedisService } from "ondc-automation-cache-lib";
import { logError, logger, logInfo } from "../utils/logger";

// key : FLOW_STATUS_{transaction_id}::{subscriber_url}::{flow_id}
export type MockStatusCode = "WORKING" | "AVAILABLE" | "SUSPENDED";
type MockFlowStatusCache = {
	// targetedAction: string;
	status: MockStatusCode;
};

export function createFlowStatusCacheKey(
	transactionId: string,
	subscriberUrl: string
) {
	logInfo({
		message: "Creating flow status cache key",
	});
	return `FLOW_STATUS_${transactionId}::${subscriberUrl}`;
}

export async function getFlowStatusService(
	transactionId: string,
	subscriberUrl: string
): Promise<MockFlowStatusCache> {
	logInfo({
		message: "Entering getFlowStatusService Function.",
		meta: {
			transactionId,
			subscriberUrl,
		},
		transaction_id: transactionId,
	});
	try {
		const key = createFlowStatusCacheKey(transactionId, subscriberUrl);
		if (await RedisService.keyExists(key)) {
			const flowStatus = await RedisService.getKey(key);
			if (flowStatus) {
				logInfo({
					message: "Exiting getFlowStatusService Function. Flow status found in cache",
					meta: {
						transactionId,
						subscriberUrl,
						flowStatus,
					},
					transaction_id: transactionId,
				});
				return JSON.parse(flowStatus) as MockFlowStatusCache;
			}
		}
		logInfo({
			message: "Exiting getFlowStatusService Function. Returning 'AVAILABLE' status",
			meta: {
				transactionId,
				subscriberUrl,
			},
			transaction_id: transactionId,
		});
		return {
			status: "AVAILABLE",
		};
	} catch (error) {
		// logger.error("Error in getting flow status", error);
		logError({
			message: "Error in getFlowStatusService Function.",
			meta: {
				transactionId,
				subscriberUrl,
			},
			error,
		});
		return {
			status: "AVAILABLE",
		};
	}
}

export async function setFlowStatusService(
	transactionId: string,
	subscriberUrl: string,
	flowStatus: MockStatusCode
) {
	try {
		logInfo({
			message: "Entering setFlowStatusService Function",
			meta: {
				transactionId,
				subscriberUrl,
				flowStatus,
			},
			transaction_id: transactionId,
		});
		const key = createFlowStatusCacheKey(transactionId, subscriberUrl);
		await RedisService.setKey(
			key,
			JSON.stringify({
				status: flowStatus,
			}),
			60 * 60 * 5
		);
		logInfo({
			message: "Exiting setFlowStatusService Function. Flow status set successfully",
			meta: {
				transactionId,
				subscriberUrl,
				flowStatus,
			},
			transaction_id: transactionId,
		});
	} catch (error) {
		// logger.error("Error in setting flow status", error);
		logError({
			message: "Error in setFlowStatusService Function.",
			meta: {
				transactionId,
				subscriberUrl,
				flowStatus,
			},
			error,
		});
	}
}

export async function deleteFlowStatusService(
	transactionId?: string,
	subscriberUrl?: string
) {
	logInfo({
		message: "Entering deleteFlowStatusService Function.",
		meta: {
			transactionId,
			subscriberUrl,
		},
	});

	if (!transactionId || !subscriberUrl) {
		// logger.error("Transaction ID or Subscriber URL is missing");
		logInfo({
			message: "Exiting deleteFlowStatusService Function. Transaction ID or Subscriber URL is missing",
			meta: {
				transactionId,
				subscriberUrl,
			},
		});
		return;
	}
	try {
		const key = createFlowStatusCacheKey(transactionId, subscriberUrl);
		if (await RedisService.keyExists(key)) {
			await RedisService.deleteKey(key);
		}
		logInfo({
			message: "Exiting deleteFlowStatusService Function. Flow status deleted successfully",
			meta: {
				transactionId,
				subscriberUrl,
			},
		});
	} catch (error) {
		// logger.error("Error in deleting flow status", error);
		logError({
			message: "Error in deleteFlowStatusService Function.",
			meta: {
				transactionId,
				subscriberUrl,
			},
			error,
		});
	}
}
