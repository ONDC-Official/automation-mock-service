import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import { RedisService } from "ondc-automation-cache-lib";
import jsonpath from "jsonpath";

import { SessionData } from "../config/TRV11/session-types";
import  { logInfo, logError, logDebug } from "../utils/logger";
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
	// logger.info(`updating session`);
	logInfo({
		message: "Entering updateSessionData Function",
		transaction_id: payload?.context.transaction_id,
	});
	try {
		for (const key in saveData) {
			const jsonPath = saveData[key as keyof typeof saveData];
			const result = jsonpath.query(payload, jsonPath);

			// logger.debug(`updating ${key} for path $${jsonPath}`);
			logDebug({
				message: `Updating ${key} for path $${jsonPath}`,
				transaction_id: payload?.context.transaction_id,
			});
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
		logInfo({
			message: "Exiting updateSessionData Function",
			transaction_id: payload?.context.transaction_id,
		});
	} catch (e) {
		// logger.error("Error in updating session data", e);
		logError({
			message: "Error in updateSessionData Function",
			error: e,
			transaction_id: payload?.context.transaction_id,
		});		
	}
}
function yamlToJson(filePath: string): object {
	try {
		logInfo({
			message: "Entering yamlToJson Function",
		});
		const fileContents = fs.readFileSync(filePath, "utf8");
		const jsonData = yaml.load(fileContents) as any;
		logInfo({
			message: "Exiting yamlToJson Function",
		});
		return jsonData;
	} catch (error) {
		logError({
			message: "Error in yamlToJson Function",
			error: error,
		});
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
		logInfo({
			message: "Entering SaveData Function",
			transaction_id: payload?.context.transaction_id,
		});
		const sessionData = await loadSessionData(payload?.context.transaction_id);
		const actionFolderPath = path.resolve(
			__dirname,
			`../config/TRV11/METRO/${payload.context.version}/${action}`
		);
		const saveDataFilePath = path.join(actionFolderPath, "save-data.yaml");
		const fileContent = fs.readFileSync(saveDataFilePath, "utf8");
		const saveData = yaml.load(fileContent) as any;
		updateSessionData(saveData["save-data"], payload, sessionData, errorData);
		await RedisService.setKey(
			payload?.context.transaction_id,
			JSON.stringify(sessionData)
		);
		// logger.info("Data saved to session");
		logInfo({
			message: "Exiting SaveData Function. Data saved to session",
			transaction_id: payload?.context.transaction_id,
		});
	} catch (e) {
		// logger.error("Error in saving data to session", e);
		logError({
			message: "Error in SaveData Function",
			error: e,
			transaction_id: payload?.context.transaction_id,
		});
	}
}

export async function loadSessionData(
	transactionID: string,
	subscriber_url?: string
) {
	logInfo({
		message: "Entering LoadSessionData Function",
		transaction_id: transactionID,
	});
	const keyExists = await RedisService.keyExists(transactionID);
	let sessionData: SessionData = {} as SessionData;
	if (!keyExists) {
		const raw = yamlToJson(
			path.resolve(__dirname, "../config/TRV11/session-data.yaml")
		) as any;
		sessionData = raw.session_data;
		sessionData.transaction_id = transactionID;
		sessionData.bpp_id = sessionData.bap_id = "dev-automation.ondc.org";
		sessionData.bap_uri = process.env.BAP_URI;
		sessionData.bpp_uri = process.env.BPP_URI;
		sessionData.subscriber_url = subscriber_url;
		logInfo({message:`new session data is ${JSON.stringify(sessionData)}`});
		logInfo({
			message: "Exiting LoadSessionData Function",
			transaction_id: transactionID,
		});
		return sessionData;
	} else {
		const rawData = await RedisService.getKey(transactionID);
		logInfo({message:`loading session data for ${transactionID}`});
		const sessionData = JSON.parse(rawData ?? "{}") as SessionData;
		logInfo({
			message: "Exiting LoadSessionData Function",
			transaction_id: transactionID,
		});
		return sessionData;
	}
}
