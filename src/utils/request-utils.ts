import axios from "axios";
import logger from "@ondc/automation-logger";

export async function sendToApiService(
	action: string,
	body: any,
	queryData = {}
) {
	try {
		const version = body.context.version ?? body.context.core_version;
		const domain = body.context.domain;
		const url = createApiServiceUrl(version, `mock/${action}`, domain);
		logger.info(`Sending response to api service ${url} ${action}`);
		const result = await axios.post(url, body, {
			params: {
				...queryData,
			},
		});
		logger.info(`Response from api service: ${result.status}`, result.data);
	} catch (err) {
		logger.error("Error in sending response to api service", err);
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
	const domain = process.env.DOMAIN;
	if (!domain) {
		throw new Error("Domain is required in env");
	}
	const url = createApiServiceUrl(version, `form/html-form`, domain);
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

export function createApiServiceUrl(
	version: string,
	path: string,
	domain: string
) {
	// const domain = process.env.DOMAIN;
	return `${process.env.API_SERVICE_URL}/${domain}/${version}/${path}`;
}
