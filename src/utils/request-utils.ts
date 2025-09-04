import axios from "axios";
import logger from "@ondc/automation-logger";

export async function sendToApiService(
	action: string,
	body: any,
	queryData = {}
) {
	try {
		const domain = process.env.DOMAIN;
		const version = body.context.version ?? body.context.core_version;
		const url = createApiServiceUrl(version, `mock/${action}`);
		console.log(action, JSON.stringify(body.message, null, 2));
		// await saveData(action, body);
		logger.debug(`Sending response to api service ${url} ${action}`);
		const result = await axios.post(url, body, {
			params: {
				...queryData,
			},
		});
	} catch (err) {
		logger.error("Error in sending response to api service", err);
		// throw new Error(
		// 	`Error in sending response to api service: ${err instanceof Error ? err.message : "Unknown error"}`
		// );
	}
}

export async function sendToApiServiceAboutForm(
	subscriberUrl: string,
	transactionId: string,
	formActionId: string,
	formType: string,
	version: string,
	submissionId?: string,
	error?: any
) {
	const url = createApiServiceUrl(version, `form/html-form`);
	const body = {
		subscriber_url: subscriberUrl,
		transaction_id: transactionId,
		form_action_id: formActionId,
		submissionId: submissionId,
		error: error,
	};
	await axios.post(url, body);
}

export function createSellerUrl(domain: string, version: string) {
	return `${process.env.API_SERVICE_URL}/${domain}/${version}/seller`;
}

export function createBuyerUrl(domain: string, version: string) {
	return `${process.env.API_SERVICE_URL}/${domain}/${version}/buyer`;
}

export function createApiServiceUrl(version: string, path: string) {
	const domain = process.env.DOMAIN;
	return `${process.env.API_SERVICE_URL}/${domain}/${version}/${path}`;
}
