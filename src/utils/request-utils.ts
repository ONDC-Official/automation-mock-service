import axios from "axios";
import logger from "./logger";
import { saveData } from "../services/data-services";

export async function sendToApiService(
	action: string,
	body: any,
	queryData = {}
) {
	try {
		console.log("The domain is",JSON.stringify(body));
		// const domain = process.env.DOMAIN;
		const domain = body.context.domain
		const version = body.context.version ?? body.context.core_version;
		const url = `${process.env.API_SERVICE_LAYER}/${domain}/${version}/mock/${action}`;
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
	return `${process.env.API_SERVICE_LAYER}/${domain}/${version}/seller`;
}

export function createBuyerUrl(domain: string, version: string) {
	return `${process.env.API_SERVICE_LAYER}/${domain}/${version}/buyer`;
}
