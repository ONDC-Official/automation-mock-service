import { Session } from "inspector/promises";
import { confirmGenerator } from "./confirm/generator";
import { initGenerator } from "./init/generator";
import { onConfirmGenerator } from "./on_confirm/on_confirm/generator";
import { onInitGenerator } from "./on_init/generator";
import { onSearchGenerator } from "./on_search/on_search/generator";
import { onSelectGenerator } from "./on_select/generator";
import { searchGenerator } from "./search/search1/generator";
import { selectGenerator } from "./select/generator";
import { cancelSoftGenerator } from "./cancel/cancel_soft/generator";
import { onCancelSoftGenerator } from "./on_cancel/on_cancel_soft/generator";
import { cancelHardGenerator } from "./cancel/cancel_hard/generator";
import { onCancelHardGenerator } from "./on_cancel/on_cancel_hard/generator";
import { onConfirmDelayedGenerator } from "./on_confirm/on_confirm_delayed/generator";
import { statusGenerator } from "./status/status_ref_id/generator";
import { onStatusActiveGenerator } from "./on_status/on_status_active/generator";
import { cancelTechGenerator } from "./cancel/cancel_tech/generator";
import { onCancelGenerator } from "./on_cancel/on_cancel/generator";
import { onCancelInitGenerator } from "./on_cancel/on_cancel_init/generator";
import { onStatusCancellationGenerator } from "./on_status/on_status_cancellation/generator";
import { search0Generator } from "./search/search0/generator";
import { onSearchCatalogGenerator } from "./on_search/on_search_catalog/generator";
import { onUpdateAcceptedGenerator } from "./on_update/on_update_accepted/generator";
import { onConfirmVehConfGenerator } from "./on_confirm/on_confirm_vehicle/generator";
import { updateGenerator } from "./update_/generator";
import { onUpdateVehConGenerator } from "./on_update/on_update_vehicle/generator";

export async function Generator(
  action_id: string,
  existingPayload: any,
  sessionData: any
) {
  switch (action_id) {
    case "search_BUS_201":
      return await searchGenerator(existingPayload, sessionData);
    case "on_search_BUS_201":
      return await onSearchGenerator(existingPayload, sessionData);
    case "select_BUS_201":
      return await selectGenerator(existingPayload, sessionData);
    case "on_select_BUS_201":
      return await onSelectGenerator(existingPayload, sessionData);
    case "init_BUS_201":
      return await initGenerator(existingPayload, sessionData);
    case "on_init_BUS_201":
      return await onInitGenerator(existingPayload, sessionData);
    case "confirm_BUS_201":
      return await confirmGenerator(existingPayload, sessionData);
    case "on_confirm_BUS_201":
      return await onConfirmGenerator(existingPayload, sessionData);
    case "cancel_soft_BUS_201":
      return await cancelSoftGenerator(existingPayload, sessionData);
    case "on_cancel_soft_BUS_201":
      return await onCancelSoftGenerator(existingPayload, sessionData);
    case "cancel_hard_BUS_201":
      return await cancelHardGenerator(existingPayload, sessionData);
    case "on_cancel_hard_BUS_201":
      return await onCancelHardGenerator(existingPayload, sessionData);
    case "on_confirm_delayed_BUS_201":
      return await onConfirmDelayedGenerator(existingPayload, sessionData);
    case "status_BUS_201":
      return await statusGenerator(existingPayload, sessionData);
    case "on_status_active_BUS_201":
      return await onStatusActiveGenerator(existingPayload, sessionData);
    case "cancel_tech_BUS_201":
      return await cancelTechGenerator(existingPayload, sessionData);
    case "on_cancel_BUS_201":
      return await onCancelGenerator(existingPayload, sessionData);
    case "on_cancel_init_BUS_201":
      return await onCancelInitGenerator(existingPayload, sessionData);
    case "on_status_cancellation_BUS_201":
      return await onStatusCancellationGenerator(existingPayload, sessionData);
    case "search0_BUS_201":
      return await search0Generator(existingPayload, sessionData);
    case "on_search_catalog1_BUS_201":
      return await onSearchCatalogGenerator(existingPayload,sessionData)
    case "on_search_catalog2_BUS_201":
      return await onSearchCatalogGenerator(existingPayload,sessionData)
    case "on_search_catalog3_BUS_201":
      return await onSearchCatalogGenerator(existingPayload,sessionData)
    case "on_search_catalog4_BUS_201":
      return await onSearchCatalogGenerator(existingPayload,sessionData)
    case "on_update_accepted_BUS_201":
      return await onUpdateAcceptedGenerator(existingPayload,sessionData)
    case "on_confirm_veh_con_BUS_201":
      return await onConfirmVehConfGenerator(existingPayload,sessionData)
    case "update_BUS_201":
      return await updateGenerator(existingPayload,sessionData)
    case "on_update_veh_con_BUS_201":
      return await onUpdateVehConGenerator(existingPayload,sessionData)
    default:
      throw new Error(`Invalid request type ${action_id}`);
  }
}
