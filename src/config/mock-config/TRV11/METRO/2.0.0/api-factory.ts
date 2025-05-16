import { confirmGenerator } from "./confirm/generator";
import { onCancelHardGenerator } from "./on_cancel/on_cancel_hard/generator";
import { onCancelSoftGenerator } from "./on_cancel/on_cancel_soft/generator";
import { onConfirmGenerator } from "./on_confirm/on_confirm/generator";
import { onConfirmDelayedGenerator } from "./on_confirm/on_confirm_delayed/generator";
import { onSelectGenerator } from "./on_select/generator";
import { selectGenerator } from "./select/generator";
import { statusActiveGenerator} from "./status/status_active/generator";
import { onInitGenerator } from "./on_init/generator";
import { initGenerator } from "./init/generator";
import { search1Generator } from "./search/search1/generator";
import { search2Generator } from "./search/search2/generator";
import { cancelSoftGenerator } from "./cancel/cancel_soft/generator";
import { cancelHardGenerator } from "./cancel/cancel_hard/generator";
import { onSearch1Generator } from "./on_search/on_search1/generator";
import { onSearch2Generator } from "./on_search/on_search2/generator";
import { onStatusCompleteGenerator } from "./on_status/on_status_complete/generator";
import { statusTechCancelGenerator } from "./status/status_tech_cancel/generator";
import { onStatusActiveGenerator } from "./on_status/on_status_active/generator";
import { cancelGenerator } from "./cancel/cancel_tech/generator";
import { onCancelGenerator } from "./on_cancel/on_cancel/generator";

export async function Generator(
	action_id: string,
	existingPayload: any,
	sessionData: any
) {
	switch (action_id) {
		case "search1_METRO_200":
			return await search1Generator(existingPayload, sessionData);
		case "search2_METRO_200":
			return await search2Generator(existingPayload, sessionData);
		case "select_METRO_200":
			return await selectGenerator(existingPayload, sessionData);
		case "init_METRO_200":
			return await initGenerator(existingPayload, sessionData);
		case "confirm_METRO_200":
			return await confirmGenerator(existingPayload, sessionData);
		case "status_METRO_200":
			return await statusActiveGenerator(existingPayload, sessionData);
		case "status_tech_cancel_METRO_200":
			return await statusTechCancelGenerator(existingPayload, sessionData);
		case "cancel_soft_METRO_200":
			return await cancelSoftGenerator(existingPayload, sessionData);
		case "cancel_METRO_200":
			return await cancelHardGenerator(existingPayload, sessionData);
		case "cancel_hard_METRO_200":
			return await cancelHardGenerator(existingPayload, sessionData);
		case "on_search1_METRO_200":
			return await onSearch1Generator(existingPayload, sessionData);
		case "on_search2_METRO_200":
			return await onSearch2Generator(existingPayload, sessionData);
		case "on_select_METRO_200":
			return await onSelectGenerator(existingPayload, sessionData);
		case "on_init_METRO_200":
			return await onInitGenerator(existingPayload, sessionData);
		case "on_confirm_METRO_200":
			return await onConfirmGenerator(existingPayload, sessionData);
		case "on_status_active_METRO_200":
			return await onStatusActiveGenerator(existingPayload, sessionData);
		case "on_status_complete_METRO_200":
			return await onStatusCompleteGenerator(existingPayload, sessionData);
		case "on_confirm_delayed_METRO_200":
			return await onConfirmDelayedGenerator(existingPayload, sessionData);
		case "on_cancel_soft_METRO_200":
			return await onCancelSoftGenerator(existingPayload, sessionData);
		case "on_cancel_hard_METRO_200":
			return await onCancelHardGenerator(existingPayload, sessionData);
		case "cancel_tech_METRO_200":
			return await cancelGenerator(existingPayload,sessionData)
		case "on_cancel_METRO_200":
			return await onCancelGenerator(existingPayload,sessionData)
		default:
			throw new Error(`Invalid request type ${action_id}`);
	}
}
