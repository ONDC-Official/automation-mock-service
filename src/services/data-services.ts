import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import { RedisService } from "ondc-automation-cache-lib";
import jsonpath from "jsonpath";

import { SessionData } from "../config/NIC2004:60232/session-types";
import logger from "../utils/logger";
import { isArrayKey } from "../types/type-utils";

export function updateSessionData(
	saveData: Record<string, string>,
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
			const jsonPath = saveData[key as keyof typeof saveData];
		
 			const result = jsonpath.query(payload, jsonPath);
			 if(key === "on_search_items") {
				console.log("jsonpath", jsonPath)
				console.log("payload", JSON.stringify(payload, null, 2))
				console.log("resuult: ", JSON.stringify(result,null, 2))
			}
			logger.debug(`updating ${key} for path $${jsonPath}`);
			if (
				isArrayKey<SessionData>(key as keyof typeof sessionData, sessionData)
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
	errorData?: {
		code: number;
		message: string;
	}
) {
	try {
		const sessionData = await loadSessionData(payload?.context.transaction_id);

		let relativePath = ""

		if(payload.context.domain === "nic2004:60232") {
			relativePath = `../config/NIC2004:60232/LOGISTICS/${payload.context.core_version}/${action}`
		} else {
			relativePath = `../config/TRV11/METRO/${payload.context.version}/${action}`
		}
		
		const actionFolderPath = path.resolve(
			__dirname,
			relativePath
		);
		const saveDataFilePath = path.join(actionFolderPath, "save-data.yaml");
		const fileContent = fs.readFileSync(saveDataFilePath, "utf8");
		const saveData = yaml.load(fileContent) as any;
		updateSessionData(saveData["save-data"], payload, sessionData, errorData);
		console.log("updated session data", sessionData)
		await RedisService.setKey(
			payload?.context.transaction_id,
			JSON.stringify(sessionData)
		);
		logger.info("Data saved to session");
	} catch (e) {
		logger.error("Error in saving data to session", e);
	}
}

export async function loadSessionData(
	transactionID: string,
	subscriber_url?: string
) {
	const keyExists = await RedisService.keyExists(transactionID);
	let sessionData: SessionData = {} as SessionData;
	if (!keyExists) {
		const raw = yamlToJson(
			path.resolve(__dirname, "../config/NIC2004:60232/session-data.yaml")
		) as any;
		sessionData = raw.session_data;
		sessionData.transaction_id = transactionID;
		sessionData.bpp_id = sessionData.bap_id = "dev-automation.ondc.org";
		// NEED TO FIX
		sessionData.bap_uri = "https://dev-automation.ondc.org/api-service/nic2004:60232/1.2.5/buyer";
		sessionData.bpp_uri = "https://dev-automation.ondc.org/api-service/nic2004:60232/1.2.5/seller";
		sessionData.subscriber_url = subscriber_url;
		logger.info(`new session data is ${JSON.stringify(sessionData)}`);
		return sessionData;
	} else {
		const rawData = await RedisService.getKey(transactionID);
		logger.info(`loading session data for ${transactionID}`);
		const sessionData = JSON.parse(rawData ?? "{}") as SessionData;
		return sessionData;
	}
}
