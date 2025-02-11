import { confirmGenerator } from "./confirm/generator";
import { onCancelHardGenerator } from "./on_cancel/on_cancel_hard/generator";
import { onCancelSoftGenerator } from "./on_cancel/on_cancel_soft/generator";
import { onConfirmGenerator } from "./on_confirm/on_confirm/generator";
import { onConfirmDelayedGenerator } from "./on_confirm/on_confirm_delayed/generator";
import { onSelectGenerator } from "./on_select/generator";
import { selectGenerator } from "./select/generator";
import { statusGenerator } from "./status/generator";
import { onInitGenerator } from "./on_init/generator";
import { initGenerator } from "./init/generator";
import { search1Generator } from "./search/search1/generator";
import { search2Generator } from "./search/search2/generator";
import { cancelSoftGenerator } from "./cancel/cancel_soft/generator";
import { cancelHardGenerator } from "./cancel/cancel_hard/generator";
import { onSearch1Generator } from "./on_search/on_search1/generator";
import { onSearch2Generator } from "./on_search/on_search2/generator";
import { onStatusCompleteGenerator } from "./on_status/on_status_complete/generator";

export async function Generator(
	action_id: string,
	existingPayload: any,
	sessionData: any
) {
	switch (action_id) {
		case "search1":
			return await search1Generator(existingPayload, sessionData);
		case "search2":
			return await search2Generator(existingPayload, sessionData);
		case "select":
			return await selectGenerator(existingPayload, sessionData);
		case "init":
			return await initGenerator(existingPayload, sessionData);
		case "confirm":
			return await confirmGenerator(existingPayload, sessionData);
		case "status":
			return await statusGenerator(existingPayload, sessionData);
		case "cancel_soft":
			return await cancelSoftGenerator(existingPayload, sessionData);
		case "cancel_hard":
			return await cancelHardGenerator(existingPayload, sessionData);
		case "on_search1":
			return await onSearch1Generator(existingPayload, sessionData);
		case "on_search2":
			return await onSearch2Generator(existingPayload, sessionData);
		case "on_select":
			return await onSelectGenerator(existingPayload, sessionData);
		case "on_init":
			return await onInitGenerator(existingPayload, sessionData);
		case "on_confirm":
			return await onConfirmGenerator(existingPayload, sessionData);
		case "on_status_complete":
			return await onStatusCompleteGenerator(existingPayload, sessionData);
		case "on_confirm_delayed":
			return await onConfirmDelayedGenerator(existingPayload, sessionData);
		case "on_cancel_soft":
			return await onCancelSoftGenerator(existingPayload, sessionData);
		case "on_cancel_hard":
			return await onCancelHardGenerator(existingPayload, sessionData);
		default:
			throw new Error(`Invalid request type ${action_id}`);
	}
}
