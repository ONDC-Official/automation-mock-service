import axios from "axios";
import logger from "@ondc/automation-logger";
import { saveData } from "../services/data-services";
import { error } from "console";
function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function sendToApiService(
	action: string,
	body: any,
	queryData: any,
	loggerMeta: any
) {
	try {
		const domain = body.context.domain;
		const version = body.context.version ?? body.context.core_version;
		const url = `${process.env.API_SERVICE_URL}/${domain}/${version}/mock/${action}`;
		const subscriber_url = queryData.subscriber_url;
		if (!subscriber_url) {
			throw new Error("subscriber url not provided");
		}
		logger.info(
			`Sending response to API service at ${url} for action: ${action}`,
			loggerMeta,
			{
				queryData: queryData,
			}
		);
		await saveData(action, body);
		await axios.post(url, body, {
			params: {
				...queryData,
			},
			headers: {
				"X-Request-ID": loggerMeta.correlationId,
			},
		});
	} catch (err) {
		logger.error("Error in sending response to api service", loggerMeta, err);
	}
}

export function createSellerUrl(domain: string, version: string) {
	return `${process.env.API_SERVICE_URL}/${domain}/${version}/seller`;
}

export function createBuyerUrl(domain: string, version: string) {
	return `${process.env.API_SERVICE_URL}/${domain}/${version}/buyer`;
}
