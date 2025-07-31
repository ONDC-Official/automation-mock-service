// import { getActionData } from "../config/mock-config";
// import { actionSelectionCodeTests } from "../config/mock-config/generated/action-selector";
// import { loadMockSessionData } from "./data-services";

// export async function getSessionData(
// 	transactionID: string,
// 	subscriber_url: string
// ) {
// 	logInfo({
// 		message: "Inside getSessionData Function. Calling loadMockSessionData",
// 		meta: { transactionID, subscriber_url },
// 		transaction_id: transactionID,
// 		});
// 	return await loadMockSessionData(transactionID, subscriber_url);
// }

// export async function getSafeActions(
// 	transaction_id: string,
// 	subscriber_url: string,
// 	mock_type?: string,
// 	usecaseId?: string
// ) {
// 	logInfo({
// 		message: "Entering getSafeActions Function.",
// 		meta: { transaction_id, subscriber_url, mock_type, usecaseId },
// 		transaction_id: transaction_id,
// 	});

// 	const sessionData = await getSessionData(transaction_id, subscriber_url);
// 	sessionData.mock_type = mock_type;
// 	sessionData.usecaseId = usecaseId;
// 	const actionsTests = actionSelectionCodeTests(
// 		"search",
// 		{},
// 		true,
// 		sessionData
// 	);
// 	const validCodes = actionsTests
// 		.filter((test) => test.valid && test.code != 200)
// 		.map((test) => test.code);
// 	const safeActions =  validCodes.map((code) => getActionData(code));
// 	logInfo({
// 		message: "Exiting getSafeActions Function.",
// 		meta: { transaction_id, subscriber_url, safeActions },
// 		transaction_id: transaction_id,
// 		});
// 	return safeActions;
// }
