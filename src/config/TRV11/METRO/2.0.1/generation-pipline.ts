import { createContext } from "./create-context";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { error } from "console";
import { SessionData } from "../../session-types";
import { Generator } from "../2.0.1/api-factory";
import logger from "../../../../utils/logger";
function yamlToJson(filePath: string): object {
	try {
		// Read the YAML file contents
		const fileContents = fs.readFileSync(filePath, "utf8");

		// Convert the YAML content to a JSON-compatible JavaScript object
		const jsonData = yaml.load(fileContents) as any;
		// Return the converted JSON data
		return jsonData;
	} catch (error: any) {
		console.error(
			`Error reading or parsing YAML file at ${filePath}: ${error.message}`
		);
		throw error;
	}
}

function loadFactoryYaml(filePath: string): any {
	try {
		const fileContents = fs.readFileSync(filePath, "utf8");
		const data: any = yaml.load(fileContents) as any;
		return data;
	} catch (error) {
		console.error("Error reading factory YAML:", error);
		throw error;
	}
}
function getDetailsByActionId(
	actionId: string,
	factoryData: any
): { default: string; action: string; message_id: boolean } {
	const entry = factoryData.codes.find(
		(item: any) => item.action_id === actionId
	);
	if (entry) {
		return {
			default: entry.default,
			action: entry.action,
			message_id: entry.message_id,
		};
	}
	throw new Error("Invalid action id found!");
}

export async function createMockReponse2(
	actionID: string,
	sessionData: SessionData
) {
	// 1. create context
	// 2. load default
	// 3. run faker

	const factoryData = loadFactoryYaml(
		path.resolve(__dirname, "../2.0.1/factory.yaml")
	);
	const api_details = getDetailsByActionId(actionID, factoryData);
	const context_object = {
		action: api_details?.action,
		transaction_id: sessionData?.transaction_id,
		bap_id: sessionData?.bap_id,
		bap_uri: sessionData?.bap_uri,
		bpp_id: sessionData?.bpp_id,
		bpp_uri: sessionData?.bpp_uri,
		location: {
			city: {
				code: sessionData.city_code ?? "std:011",
			},
			country: {
				code: "IND",
			},
		},
	};

	let context = createContext(context_object);
	if (!api_details.message_id) {
		context.message_id = sessionData.message_id as string;
	}
	console.log(api_details);
	const default_message = yamlToJson(
		path.resolve(__dirname, api_details.default)
	);
	const payload: any = {
		context: { ...context },
		...default_message,
	};
	if (sessionData.error_code && sessionData.error_message) {
		const error_message = {
			code: `${sessionData.error_code}`,
			message: sessionData.error_message,
		};
		delete payload.message;
		payload.error = error_message;
		logger.debug(`Error payload is ${JSON.stringify(payload)}`);
		return payload;
	}
	return await Generator(actionID, payload, sessionData);
}
