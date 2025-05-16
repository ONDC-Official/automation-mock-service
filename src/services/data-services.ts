import fs from "fs";
import yaml from "js-yaml";
import { RedisService } from "ondc-automation-cache-lib";
import jsonpath from "jsonpath";

import logger from "../utils/logger";
import { isArrayKey } from "../types/type-utils";
import {
	defaultSessionData,
	getSaveDataContent,
	MockSessionData,
} from "../config/mock-config";
import { SessionData } from "../config/mock-config/TRV11/session-types";

export function updateSessionData(
	saveData: Record<
	  string,
	  string | { path: string; mode?: "append" | "override" }
	>,
	payload: any,
	sessionData: SessionData,
	errorData?: {
	  code: number;
	  message: string;
	}
  ) {
	logger.info(`updating session`);
	try {
	  for (const key in saveData) {
		const entry = saveData[key];
		let jsonPath: string;
		let mode: "append" | "override" = "override"; // default mode
  
		// Support legacy string format
		if (typeof entry === "string") {
		  jsonPath = entry;
		} else {
		  jsonPath = entry.path;
		  mode = entry.mode ?? "override";
		}
  
		const result = jsonpath.query(payload, jsonPath);
		logger.debug(`updating ${key} for path ${jsonPath} with mode ${mode}`);
  
		if (mode === "append") {
		  const existing = sessionData[key as keyof SessionData] || [];
		  if (!Array.isArray(existing)) {
			logger.warn(`Expected array for ${key}, found: ${typeof existing}`);
			sessionData[key as keyof SessionData] = result;
			continue;
		  }
		  sessionData[key as keyof SessionData] = existing.concat(result);
		} else {
		  if (isArrayKey<SessionData>(key as keyof SessionData, sessionData)) {
			sessionData[key as keyof SessionData] = result;
		  } else {
			sessionData[key as keyof SessionData] = result[0];
		  }
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
function yamlToJson(filePath: string): object {
	try {
		const fileContents = fs.readFileSync(filePath, "utf8");
		const jsonData = yaml.load(fileContents) as any;
		return jsonData;
	} catch (error) {
		throw error;
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
	try {
		const sessionData = await loadMockSessionData(
			`MOCK_${payload?.context.transaction_id}::${subscriber_url}`,
			subscriber_url
		);
		const saveData = getSaveDataContent(payload.context.version, action);
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
	subscriber_url: string
) {
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
		logger.info(`new session data is ${JSON.stringify(sessionData)}`);
		return sessionData;
	} else {
		const rawData = await RedisService.getKey(
			`MOCK_${transactionID}::${subscriber_url}`
		  );
		logger.info(`loading session data for ${transactionID}`);
		const sessionData = JSON.parse(rawData ?? "{}") as MockSessionData;
		return sessionData;
	}
}
