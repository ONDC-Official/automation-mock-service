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
	saveData["bap_id"] = "$.context.bap_id"
	saveData["bpp_id"] = "$.context.bpp_id"
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
	logger.info(`[loadMockSessionData] Called with transactionID: ${transactionID}`);
	const keyExists = await RedisService.keyExists(transactionID);
	logger.info(`[loadMockSessionData] Redis key exists: ${keyExists}`);
	let sessionData: MockSessionData = {} as MockSessionData;
	if (!keyExists) {
		logger.info(`[loadMockSessionData] Entering IF block (new session)`);

		const raw = defaultSessionData();
		const apiServiceUrl =
			process.env.API_SERVICE_URL ||
			"https://dev-automation.ondc.org/api-service";
		logger.info(`[loadMockSessionData] API_SERVICE_URL: ${apiServiceUrl}`);
		const ownerId = apiServiceUrl.split("//")[1].split("/")[0];
		logger.info(`[loadMockSessionData] Extracted ownerId: ${ownerId}`);
		sessionData = raw.session_data;
		sessionData.transaction_id = transactionID;
		sessionData.bpp_id = sessionData.bap_id = ownerId;
		sessionData.bpp_id = ownerId?? "dev-automation.ondc.org";
		logger.info(
			`[loadMockSessionData] After setting IDs -> bpp_id: ${sessionData.bpp_id}, bap_id: ${sessionData.bap_id}`
		);
		console.log("ownerId loadMockSessionData", ownerId);
		sessionData.bap_uri = "https://dev-automation.ondc.org/buyer";
		sessionData.bpp_uri = "https://dev-automation.ondc.org/seller";
		sessionData.subscriber_url = subscriber_url;
		logger.info(`new session data is ${JSON.stringify(sessionData)}`);
		return sessionData;
	} else {
		logger.info(`[loadMockSessionData] Entering ELSE block (existing session)`);
		const rawData = await RedisService.getKey(transactionID);
		logger.info(`[loadMockSessionData] Raw data from Redis: ${rawData}`);
		logger.info(`loading session data for ${transactionID}`);
		const sessionData = JSON.parse(rawData ?? "{}") as MockSessionData;
		logger.info(`[loadMockSessionData] Parsed session data (ELSE): ${JSON.stringify(sessionData)}`);
		logger.info(
			`[loadMockSessionData] Existing bpp_id: ${sessionData.bpp_id}`
		);
		return sessionData;
	}
}