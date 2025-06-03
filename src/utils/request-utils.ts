import axios from "axios";
import { saveData } from "../services/data-services";
import { logger } from "./logger";

export async function sendToApiService(
	action: string,
	body: any,
	queryData = {}
) {
	try {
		const domain = process.env.DOMAIN;
		const version = body.context.version ?? body.context.core_version;
		const url = `${process.env.API_SERVICE_URL}/${domain}/${version}/mock/${action}`;
		console.log(action, JSON.stringify(body.message, null, 2));
		await saveData(action, body);
		logger.debug(`Sending response to api service ${url} ${action}`);
		await axios.post(url, body, {
			params: {
				...queryData,
			},
		});
	} catch (err) {
		logger.error("Error in sending response to api service", err);
	}
}

export function createSellerUrl(domain: string, version: string) {
	return `${process.env.API_SERVICE_URL}/${domain}/${version}/seller`;
}

export function createBuyerUrl(domain: string, version: string) {
	return `${process.env.API_SERVICE_URL}/${domain}/${version}/buyer`;
}
