import { existsSync, readFileSync, writeFileSync } from "fs";
import yaml from "js-yaml";
import path from "path";
import { Flow } from "../../../types/flow-types";
import { defaultSessionData, getSaveDataContent, MockSessionData } from "..";
import { updateSessionData } from "../../../services/data-services";
import { v4 as uuidv4 } from "uuid";

export function loadFlowConfig() {
	const filePath = path.resolve(__dirname, "./flow-config.yaml");
	const data = readFileSync(filePath, "utf8");
	const loadedData = yaml.load(data) as {
		flows: Flow[];
	};
	return loadedData.flows[0] as Flow;
}

export async function saveDataForUnit(
	lastAction: string,
	action: string,
	payload: any,
	errorData?: {
		code: number;
		message: string;
	}
) {
	const sessionData = loadMockSessionDataUnit(lastAction);
	const saveData = getSaveDataContent(
		payload?.context?.version || payload?.context?.core_version,
		action
	);
	updateSessionData(saveData["save-data"], payload, sessionData, errorData);
	const filePath = path.resolve(__dirname, `./session-data/${action}.json`);
	writeFileSync(filePath, JSON.stringify(sessionData, null, 2));
}

export function loadMockSessionDataUnit(action: string) {
	const filePath = path.resolve(__dirname, `./session-data/${action}.json`);
	let sessionData: MockSessionData = {} as MockSessionData;
	if (!existsSync(filePath)) {
		customConsoleLog(
			"### LAST ACTION NOT FOUND RETURNING DEFAULT SAVE-DATA ###"
		);
		const raw = defaultSessionData();
		console.log(JSON.stringify(raw, null, 2));
		sessionData = raw.session_data;
		sessionData.transaction_id = uuidv4();
		sessionData.bpp_id = sessionData.bap_id = "dev-automation.ondc.org";
		sessionData.bap_uri = "https://dev-automation.ondc.org/buyer";
		sessionData.bpp_uri = "https://dev-automation.ondc.org/seller";
		sessionData.subscriber_url = "test-subscriber-url";
		return sessionData;
	}
	return JSON.parse(readFileSync(filePath, "utf8") ?? "{}");
}

export function customConsoleLog(message: string, ...meta: any[]) {
	console.log(`${message}`, ...meta, `\n`);
}
