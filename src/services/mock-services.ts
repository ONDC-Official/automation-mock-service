import { getActionData } from "../config/TRV11/METRO/getActionConfig";
import { actionSelectionCodeTests } from "../generated/action-selector";
import { defaultSelectionCodeTests } from "../generated/default-selector";
import logger from "../utils/logger";
import { loadSessionData } from "./data-services";

export async function getMockResponseMetaData(action: string, body: any) {
	logger.info("getting meta data for action " + action);
	const actionTests = defaultSelectionCodeTests(action, body, true);
	const successTest = actionTests.find(
		(test) => test.valid && test.code != 200
	);
	const code = successTest?.code;
	if (!code) {
		throw new Error("No valid test found");
	}
	const actionData = getActionData(code);
	const sessionData = await getSessionData(body.context.transaction_id);
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
	return await loadSessionData(transactionID, subscriber_url);
}

export async function getSafeActions(
	transaction_id: string,
	subscriber_url?: string,
	mock_type?: string
) {
	const sessionData = await getSessionData(transaction_id, subscriber_url);
	sessionData.mock_type = mock_type;
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
