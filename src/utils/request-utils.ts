import axios from "axios";
import logger from "@ondc/automation-logger";

export async function sendToApiService(
	action: string,
	body: any,
	queryData = {},
	loggingMeta: any
) {
	try {
		const domain = process.env.DOMAIN;
		const version = body.context.version ?? body.context.core_version;
		const url = `${process.env.API_SERVICE_URL}/${domain}/${version}/mock/${action}`;
		logger.info(`Sending response to API service at ${url}`, loggingMeta, {
			params: queryData,
		});
		await axios.post(url, body, {
			params: {
				...queryData,
			},
			headers: {
				"X-Request-ID": loggingMeta.correlationId,
			},
		});
		logger.info("✅ Response sent to API service successfully", loggingMeta);
	} catch (err: any) {
		logger.error("Error in sending response to api service", loggingMeta, err);
	}
}

export function createSellerUrl(domain: string, version: string) {
	return `${process.env.API_SERVICE_URL}/${domain}/${version}/seller`;
}

export function createBuyerUrl(domain: string, version: string) {
	return `${process.env.API_SERVICE_URL}/${domain}/${version}/buyer`;
}
