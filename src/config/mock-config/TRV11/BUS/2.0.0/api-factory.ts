import { confirmGenerator } from "./confirm/generator";
import { onCancelHardGenerator } from "./on_cancel/on_cancel_hard/generator";
import { onCancelSoftGenerator } from "./on_cancel/on_cancel_soft/generator";
import { onConfirmGenerator } from "./on_confirm/on_confirm/generator";
import { onConfirmDelayedGenerator } from "./on_confirm/on_confirm_delayed/generator";
import { onSelectGenerator } from "./on_select/generator";
import { selectGenerator } from "./select/generator";
import { statusGenerator } from "./status/status_active/generator";
import { onInitGenerator } from "./on_init/generator";
import { initGenerator } from "./init/generator";
import { search1Generator } from "./search/search1/generator";
import { search2Generator } from "./search/search2/generator";
import { cancelSoftGenerator } from "./cancel/cancel_soft/generator";
import { cancelHardGenerator } from "./cancel/cancel_hard/generator";
import { onSearch1Generator } from "./on_search/on_search1/generator";
import { onSearch2Generator } from "./on_search/on_search2/generator";
import { statusTechCancelGenerator } from "./status/status_tech_cancel/generator";
import { onStatusActiveGenerator } from "./on_status/on_status_active/generator";
import { cancelTechGenerator } from "./cancel/cancel_tech/generator";
import { onCancelTechGenerator } from "./on_cancel/on_cancel_tech/generator";

export async function Generator(
	action_id: string,
	existingPayload: any,
	sessionData: any
) {
	switch (action_id) {
		case "search1_BUS_200":
			return await search1Generator(existingPayload, sessionData);
		case "search2_BUS_200":
			return await search2Generator(existingPayload, sessionData);
		case "select_BUS_200":
			return await selectGenerator(existingPayload, sessionData);
		case "init_BUS_200":
			return await initGenerator(existingPayload, sessionData);
		case "confirm_BUS_200":
			return await confirmGenerator(existingPayload, sessionData);
		case "status_BUS_200":
			return await statusGenerator(existingPayload, sessionData);
		case "status_tech_cancel_BUS_200":
			return await statusTechCancelGenerator(existingPayload,sessionData)
		case "cancel_soft_BUS_200":
			return await cancelSoftGenerator(existingPayload, sessionData);
		case "cancel_hard_BUS_200":
			return await cancelHardGenerator(existingPayload, sessionData);
		case "on_search1_BUS_200":
			return await onSearch1Generator(existingPayload, sessionData);
		case "on_search2_BUS_200":
			return await onSearch2Generator(existingPayload, sessionData);
		case "on_select_BUS_200":
			return await onSelectGenerator(existingPayload, sessionData);
		case "on_init_BUS_200":
			return await onInitGenerator(existingPayload, sessionData);
		case "on_confirm_BUS_200":
			return await onConfirmGenerator(existingPayload, sessionData);
		case "on_status_BUS_200":
			return await onStatusActiveGenerator(existingPayload, sessionData);
		case "on_status_active_BUS_200":
			return await onStatusActiveGenerator(existingPayload, sessionData);
		case "on_confirm_delayed_BUS_200":
			return await onConfirmDelayedGenerator(existingPayload, sessionData);
		case "on_cancel_soft_BUS_200":
			return await onCancelSoftGenerator(existingPayload, sessionData);
		case "on_cancel_hard_BUS_200":
			return await onCancelHardGenerator(existingPayload, sessionData);
		case "cancel_tech_BUS_200":
			return await cancelTechGenerator(existingPayload,sessionData)
		case "on_cancel_tech_BUS_200":
			return await onCancelTechGenerator(existingPayload,sessionData)
		default:
			throw new Error(`Invalid request type ${action_id}`);
	}
}
