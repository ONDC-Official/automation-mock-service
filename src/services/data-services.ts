import { RedisService } from "ondc-automation-cache-lib";
import jsonpath from "jsonpath";
import logger from "@ondc/automation-logger";
import { isArrayKey } from "../types/type-utils";
import {
	defaultSessionData,
	getUiMetaKeys,
	MockSessionData,
} from "../config/mock-config";
import MockRunner from "@ondc/automation-mock-runner";

export async function updateSessionData(
	saveData: Record<string, string>,
	payload: any,
	sessionData: MockSessionData,
	errorData?: {
		code: number;
		message: string;
	},
	playgroundCompatibilityMode: boolean = false
) {
	logger.info(`updating session`);
	try {
		for (const key in saveData) {
			if (playgroundCompatibilityMode) {
				const path = saveData[key as keyof typeof saveData];
				const appendMode = key.startsWith("APPEND#");
				const evalMode = path.startsWith("EVAL#");
				const actualKey = key.split("#").pop() as string;
				const actualPath = evalMode ? path.split("#")[1] : path;
				const result = evalMode
					? (await MockRunner.runGetSave(payload, actualPath)).result
					: jsonpath.query(payload, actualPath);
				if (appendMode) {
					const existingData =
						(sessionData[actualKey as keyof typeof sessionData] as any[]) || [];
					sessionData[actualKey as keyof typeof sessionData] = [
						...existingData,
						...result,
					];
				} else {
					sessionData[actualKey as keyof typeof sessionData] = result;
				}
			} else {
				const jsonPath = saveData[key as keyof typeof saveData];
				const result = jsonpath.query(payload, jsonPath);
				const appendMode = key.startsWith("APPEND#");
				const actualKey = key.split("#").pop() as string;
				logger.debug(`updating ${key} for path $${jsonPath}`);
				if (appendMode) {
					const existingData =
						(sessionData[actualKey as keyof typeof sessionData] as any[]) || [];
					sessionData[actualKey as keyof typeof sessionData] = [
						...existingData,
						...result,
					];
					continue;
				}
				if (
					isArrayKey<MockSessionData>(
						actualKey as keyof typeof sessionData,
						sessionData
					)
				) {
					sessionData[actualKey as keyof typeof sessionData] = result;
				} else {
					sessionData[actualKey as keyof typeof sessionData] = result[0];
				}
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
		logger.error("Error in updating session data", {}, e);
	}
}

export async function saveDataForConfig(
	saveData: {
		"save-data": Record<string, string>;
	},
	payload: any,
	errorData?: {
		code: number;
		message: string;
	},
	playgroundCompatibilityMode: boolean = false
) {
	try {
		const sessionData = await loadMockSessionData(
			payload?.context.transaction_id
		);
		await updateSessionData(
			saveData["save-data"],
			payload,
			sessionData,
			errorData,
			playgroundCompatibilityMode
		);
		await saveCompleteData(
			JSON.stringify(sessionData),
			payload?.context.transaction_id
		);
		logger.info("Data saved to session", {
			txId: payload?.context.transaction_id,
			data: sessionData,
		});
	} catch (e) {
		logger.error("Error in saving data to session", {}, e);
	}
}

export async function saveCompleteData(data: string, transactionId: string) {
	try {
		if (!transactionId) {
			throw new Error("Transaction ID is missing, cannot save complete data");
		}
		await RedisService.setKey(transactionId, data);
		logger.info("Complete Data saved to session", {
			txId: transactionId,
			data: data,
		});
	} catch (e) {
		logger.error("Error in saving complete data to session", {}, e);
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
		const apiServiceUrl =
			process.env.API_SERVICE_URL ||
			"https://dev-automation.ondc.org/api-service";
		const ownerId = apiServiceUrl.split("//")[1].split("/")[0];
		sessionData = raw.session_data;
		sessionData.transaction_id = transactionID;
		sessionData.bpp_id = sessionData.bap_id = ownerId;
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

export function getReferenceData(sessionData: MockSessionData) {
	const listOfKeys = getUiMetaKeys();
	const referenceData: Record<string, any> = {};
	for (const key of listOfKeys) {
		logger.info(`Fetching data for key: ${key}`);
		const data = sessionData[key];
		if (data) {
			referenceData[key] = data;
		} else {
			// logger.warning(`No data found for key: ${key}`);
		}
	}
	console.log("referenceData", referenceData);
	return referenceData;
}
