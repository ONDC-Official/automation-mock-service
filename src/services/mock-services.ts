import { getActionData } from "../config/mock-config";
import { actionSelectionCodeTests } from "../config/mock-config/generated/action-selector";
import { defaultSelectionCodeTests } from "../config/mock-config/generated/default-selector";
import logger from "../utils/logger";
import { loadMockSessionData } from "./data-services";

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
	return await loadMockSessionData(transactionID, subscriber_url);
}

export async function getSafeActions(
	transaction_id: string,
	subscriber_url?: string,
	mock_type?: string,
	usecaseId?: string
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
