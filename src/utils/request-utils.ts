import axios from "../utils/axios";
import { logger, logInfo } from "./logger";
import { saveData } from "../services/data-services";
import { error } from "console";
function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function sendToApiService(
	action: string,
	body: any,
	queryData: any
) {

	logInfo({
		message: "Entering sendToApiService",
		meta: { action, body, queryData },
		transaction_id: body.context.transaction_id,
	});
	try {
		const domain = process.env.DOMAIN;
		const version = body.context.version ?? body.context.core_version;
		const url = `${process.env.API_SERVICE_LAYER}/${domain}/${version}/mock/${action}`;
		const subscriber_url = queryData.subscriber_url;
    	if (!subscriber_url) {
    //   logger.error("subscriber url not provided");
	  logInfo({
		message: "Exiting sendToApiService. Subscriber URL not provided",
		meta: { action, body, queryData },
		transaction_id: body.context.transaction_id,
	  });
      throw new Error("subscriber url not provided ");
    }
		await saveData(action, body,subscriber_url);
		// logger.debug(`Sending response to api service ${url} ${action}`);
		logInfo({
			message: "Sending response to api service",
			meta: { action, body, queryData },
			transaction_id: body.context.transaction_id,
		});
		await axios.post(url, body, {
			params: {
				...queryData,
			},
		});
		logInfo({
			message: "Exiting sendToApiService",
			meta: { action, body, queryData },
			transaction_id: body.context.transaction_id,
			});
	} catch (err) {
		// logger.error("Error in sending response to api service", err);
		logInfo({
			message: "Error in sending response to api service",
			meta: { action, body, queryData },
			transaction_id: body.context.transaction_id,
		});
	}
}

export function createSellerUrl(domain: string, version: string) {
	logInfo({
		message: "Inside createSellerUrl",
		meta: { domain, version },
	});
	return `${process.env.API_SERVICE_LAYER}/${domain}/${version}/seller`;
}

export function createBuyerUrl(domain: string, version: string) {
	logInfo({
		message: "Inside createBuyerUrl",
		meta: { domain, version },
	});
	return `${process.env.API_SERVICE_LAYER}/${domain}/${version}/buyer`;
}
