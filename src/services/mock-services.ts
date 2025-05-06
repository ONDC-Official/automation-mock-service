import { getActionData } from "../config/TRV11/getActionConfig";
import { actionSelectionCodeTests } from "../generated/action-selector";
import { defaultSelectionCodeTests } from "../generated/default-selector";
import {logInfo, logError} from "../utils/logger";
import { loadSessionData } from "./data-services";

export async function getMockResponseMetaData(action: string, body: any) {
	// logger.info("getting meta data for action " + action);
	logInfo({
		message: "Entering getMockResponseMetaData Function",
		meta:{ action },
		transaction_id: body.context.transaction_id,
	});
	const actionTests = defaultSelectionCodeTests(action, body, true);
	const successTest = actionTests.find(
		(test: any) => test.valid && test.code != 200
	);
	const code = successTest?.code;
	if (!code) {
		logError({
			message: "Error in getMockResponseMetaData Function",
			error: new Error("No valid test found"),
			transaction_id: body.context.transaction_id,
			meta:{ action },
		});
		throw new Error("No valid test found");
	}
	const actionData = getActionData(code);
	const sessionData = await getSessionData(body.context.transaction_id);
	logInfo({
		message: "Exiting getMockResponseMetaData Function",
		transaction_id: body.context.transaction_id,
		meta:{ action },
	});
	return {
		actionID: actionData.action_id,
		action: actionData.action,
		sessionData: sessionData,
	};
}

export async function getSessionData(
	transactionID: string,
	subscriber_url?: string
) {
	logInfo({
		message: "Entering getSessionData Function",
		transaction_id: transactionID,
	});
	const sessionData =  await loadSessionData(transactionID, subscriber_url);
	logInfo({
		message: "Exiting getSessionData Function",
		transaction_id: transactionID,
	});
	return sessionData;
}

export async function getSafeActions(
	transaction_id: string,
	subscriber_url?: string,
	mock_type?: string,
	usecaseId?: string,
) {
	const sessionData = await getSessionData(transaction_id, subscriber_url);
	sessionData.mock_type = mock_type;
	sessionData.usecaseId = usecaseId;
	const actionsTests = actionSelectionCodeTests(
		"search",
		{},
		true,
		sessionData
	);
	const validCodes = actionsTests
		.filter((test) => test.valid && test.code != 200)
		.map((test) => test.code);
	return validCodes.map((code) => getActionData(code));
}
