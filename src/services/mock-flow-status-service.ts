import { RedisService } from "ondc-automation-cache-lib";
import logger from "@ondc/automation-logger";

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
	return `FLOW_STATUS_${transactionId}::${subscriberUrl}`;
}

export async function getFlowStatusService(
	transactionId: string,
	subscriberUrl: string,
	loggingMeta: any
): Promise<MockFlowStatusCache> {
	try {
		logger.info(
			`Getting flow operation status for transactionId: ${transactionId} and subscriberUrl: ${subscriberUrl}`,
			loggingMeta
		);
		const key = createFlowStatusCacheKey(transactionId, subscriberUrl);
		if (await RedisService.keyExists(key)) {
			const flowStatus = await RedisService.getKey(key);
			if (flowStatus) {
				return JSON.parse(flowStatus) as MockFlowStatusCache;
			}
		}
		logger.info("Returning 'AVAILABLE' status", loggingMeta);
		return {
			status: "AVAILABLE",
		};
	} catch (error) {
		logger.error(
			"Error in getting flow status [NOTE: fallback state is 'AVAILABLE']",
			loggingMeta,
			error
		);
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
		const key = createFlowStatusCacheKey(transactionId, subscriberUrl);
		await RedisService.setKey(
			key,
			JSON.stringify({
				status: flowStatus,
			}),
			60 * 60 * 5
		);
	} catch (error) {
		logger.error("Error in setting flow status", error);
	}
}

export async function deleteFlowStatusService(
	transactionId?: string,
	subscriberUrl?: string
) {
	if (!transactionId || !subscriberUrl) {
		return;
	}
	try {
		const key = createFlowStatusCacheKey(transactionId, subscriberUrl);
		if (await RedisService.keyExists(key)) {
			await RedisService.deleteKey(key);
		}
	} catch (error) {
		logger.error("Error in deleting flow status", error);
	}
}
