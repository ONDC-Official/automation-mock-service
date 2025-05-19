import { RedisService } from "ondc-automation-cache-lib";
import jsonpath from "jsonpath";

import { logError, logger, logInfo } from "../utils/logger";
import { isArrayKey } from "../types/type-utils";
import {
	defaultSessionData,
	getSaveDataContent,
	MockSessionData,
} from "../config/mock-config";

export function updateSessionData(
	saveData: Record<string, string>,
	payload: any,
	sessionData: MockSessionData,
	errorData?: {
		code: number;
		message: string;
	}
) {
	logger.info(`updating session`);
	try {
		for (const key in saveData) {
			const jsonPath = saveData[key as keyof typeof saveData];
			const result = jsonpath.query(payload, jsonPath);
			logger.debug(`updating ${key} for path $${jsonPath}`);
			if (
				isArrayKey<MockSessionData>(
					key as keyof typeof sessionData,
					sessionData
				)
			) {
				sessionData[key as keyof typeof sessionData] = result;
			} else {
				sessionData[key as keyof typeof sessionData] = result[0];
			}
		}
		if (errorData) {
			sessionData.error_code = errorData.code.toString();
			sessionData.error_message = errorData.message;
		} else {
			sessionData.error_code = undefined;
			sessionData.error_message = undefined;
		}
	} catch (e) {
		logger.error("Error in updating session data", e);
	}
}

export async function saveData(
	action: string,
	payload: any,
	subscriber_url: string,
	errorData?: {
		code: number;
		message: string;
	}
) {
	logInfo({
		message: "Entering saveData Function.",
		meta: { action },
		transaction_id: payload?.context.transaction_id,
	});
	try {
		const sessionData = await loadMockSessionData(
			`MOCK_${payload?.context.transaction_id}::${subscriber_url}`,
			subscriber_url
		);
		const saveData = getSaveDataContent(payload?.context?.version
			|| payload?.context?.core_version, action);
		updateSessionData(saveData["save-data"], payload, sessionData, errorData);
		await RedisService.setKey(
			payload?.context.transaction_id,
			JSON.stringify(sessionData)
		);
		// logger.info("Data saved to session");
		logInfo({
			message: "Exiting saveData Function. Data saved to session.",
			meta: { action },
			transaction_id: payload?.context.transaction_id,
		});
	} catch (e) {
		// logger.error("Error in saving data to session", e);
		logError({
			message: "Error in saving data to session",
			meta: { action },
			transaction_id: payload?.context.transaction_id,
			error: e,
		});
	}
}

export async function loadMockSessionData(
	transactionID: string,
	subscriber_url: string
) {
	logInfo({
		message: "Entering loadMockSessionData Function. Loading mock session data",
		meta: { transactionID, subscriber_url },
		transaction_id: transactionID,
	});
	const key = `MOCK_${transactionID}::${subscriber_url}`
	const keyExists = await RedisService.keyExists(key);
	let sessionData: MockSessionData = {} as MockSessionData;
	if (!keyExists) {
		const raw = defaultSessionData;
		sessionData = raw.session_data;
		sessionData.transaction_id = transactionID;
		sessionData.bpp_id = sessionData.bap_id = "dev-automation.ondc.org";
		sessionData.bap_uri = "https://dev-automation.ondc.org/buyer";
		sessionData.bpp_uri = "https://dev-automation.ondc.org/seller";
		sessionData.subscriber_url = subscriber_url;
		// logger.info(`new session data is ${JSON.stringify(sessionData)}`);
		logInfo({
			message: `New session data created for transaction ID: ${transactionID}`,
			meta: { transactionID, subscriber_url },
		});
		return sessionData;
	} else {
		const rawData = await RedisService.getKey(
			`MOCK_${transactionID}::${subscriber_url}`
		  );
		// logger.info(`loading session data for ${transactionID}`);
		logInfo({
			message: `Loaded mock session data for transaction ID: ${transactionID}`,
		});
		const sessionData = JSON.parse(rawData ?? "{}") as MockSessionData;
		logInfo({
			message: `Exiting loadMockSessionData Function. Loaded mock session data for transaction ID: ${transactionID}`,
			meta: { transactionID, subscriber_url },
			transaction_id: transactionID,
			});
		return sessionData;
	}
}
