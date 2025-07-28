import fs from "fs";
import yaml from "js-yaml";
import { RedisService } from "ondc-automation-cache-lib";
import jsonpath from "jsonpath";

import { logger } from "../utils/logger";
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
			console.log("errorData", errorData);
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
	errorData?: {
		code: number;
		message: string;
	}
) {
	try {
		const sessionData = await loadMockSessionData(
			payload?.context.transaction_id
		);
		const saveData = getSaveDataContent(
			payload?.context?.version || payload?.context?.core_version,
			action
		);
		updateSessionData(saveData["save-data"], payload, sessionData, errorData);
		await RedisService.setKey(
			payload?.context.transaction_id,
			JSON.stringify(sessionData)
		);
		logger.info("Data saved to session");
	} catch (e) {
		logger.error("Error in saving data to session", e);
	}
}

export async function loadMockSessionData(
	transactionID: string,
	subscriber_url?: string
) {
	const keyExists = await RedisService.keyExists(transactionID);
	let sessionData: MockSessionData = {} as MockSessionData;
	if (!keyExists) {
		const raw = defaultSessionData();
		sessionData = raw.session_data;
		sessionData.transaction_id = transactionID;
		sessionData.bpp_id = sessionData.bap_id = "dev-automation.ondc.org";
		sessionData.bap_uri = "https://dev-automation.ondc.org/buyer";
		sessionData.bpp_uri = "https://dev-automation.ondc.org/seller";
		sessionData.subscriber_url = subscriber_url;
		logger.info(`new session data is ${JSON.stringify(sessionData)}`);
		return sessionData;
	} else {
		const rawData = await RedisService.getKey(transactionID);
		logger.info(`loading session data for ${transactionID}`);
		const sessionData = JSON.parse(rawData ?? "{}") as MockSessionData;
		return sessionData;
	}
}
