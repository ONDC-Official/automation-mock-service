import { readFileSync } from "fs";
import logger from "../../utils/logger";
import { createMockResponse } from "./TRV10/version-factory";
import path from "path";
import yaml from "js-yaml";
import { SessionData as MockSessionData } from "./TRV10/session-types";

export { MockSessionData };

const actionConfig = yaml.load(
	readFileSync(path.join(__dirname, "./TRV10/factory.yaml"), "utf8")
) as any;

export const defaultSessionData = yaml.load(
	readFileSync(path.join(__dirname, "./TRV10/session-data.yaml"), "utf8")
) as { session_data: MockSessionData };

export async function generateMockResponse(
	session_id: string,
	sessionData: any,
	action_id: string
) {
	try {
		return await createMockResponse(session_id, sessionData, action_id);
	} catch (e) {
		logger.error("Error in generating mock response", e);
		throw e;
	}
}

export function getActionData(code: number) {
	const actionData = actionConfig.codes.find(
		(action: any) => action.code === code
	);
	if (actionData) {
		return actionData;
	}
	throw new Error(`Action code ${code} not found`);
}

export function getSaveDataContent(version: string, action: string) {
	let actionFolderPath = path.resolve(
		__dirname,
		`./TRV10/${version}/${action}`
	);
	if (/\/update$/.test(actionFolderPath)) {
		actionFolderPath += "_";
	}
	const saveDataFilePath = path.join(actionFolderPath, "save-data.yaml");
	const fileContent = readFileSync(saveDataFilePath, "utf8");
	return yaml.load(fileContent) as any;
}
