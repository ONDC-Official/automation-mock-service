import { searchGenerator } from "./search/generator";
import { onSearchGenerator } from "./on_search/generator";
import { search1Generator } from "./search/search_1/generator";
import { onSearch1Generator } from "./on_search/on_search_1/generator";
import { onSearch2Generator } from "./on_search/on_search_2/generator";
import { selectGenerator } from "./select/generator";
import { onSelectGenerator } from "./on_select/generator";
import { initGenerator } from "./init/generator";
import { onInitGenerator } from "./on_init/generator";
import { confirmGenerator } from "./confirm/generator";
import { onConfirmGenerator } from "./on_confirm/generator";
import { onStatusGenerator } from "./on_status/generator";
import { onSelectOOSGenerator } from "./on_select/on_select_oos/generator";
import { cancelGenerator } from "./cancel/generator";
import { onCancelGenerator } from "./on_cancel/generator";
import { cancelForceGenerator } from "./cancel/cancel_force/generator";
import { cancelNoGenerator } from "./cancel/cancel_no/generator";
import { onSelectMultipleFulfillmentGenerator } from "./on_select/on_select_multiple_fulfillment/generator";
import { trackGenerator } from "./track/generator";
import { onTrackGenerator } from "./on_track/generator";
import { initFulfillmentArrayGenerator } from "./init/init_fulfillment_array/generator";
import { onInitFulfillmentArrayGenerator } from "./on_init/on_init_fulfillment_array/generator";
import { onSelectFulfillmentArrayGenerator } from "./on_select/on_select_fulfillment_array/generator";
import { updateAddressGenerator } from "./update/update_address/generator";
import { updateBuyerInstGenerator } from "./update/update_buyer_inst/generator";
import { onUpdateGenerator } from "./on_update/generator";
import { initMultipleFulfillmentGenerator } from "./init/init_multiple_fulfillment/generator";
import { updateSettlelmentGenerator } from "./update/update_settelment/generator";
import { onUpdatePartCancelGenerator } from "./on_update/on_update_part_cancel/generator";
import { updateReturnGenerator } from "./update/update_return/generator";
import { onUpdateReturnGenerator } from "./on_update/on_update_return/generator";
import { updateBuyerDeliveryGenerator } from "./update/update_buyer_delivery/generator";
import { onUpdateBuyerDeliveryGenerator } from "./on_update/on_update_buyer_delivery/generator";
import { onCancelRTOGenerator } from "./on_cancel/on_cancel_rto/generator";
import { onSearch3Generator } from "./on_search/on_search_3/generator";
import { updateDocumentGenerator } from "./update/update_document/generator";
import { onSelectSlottedGenerator } from "./on_select/on_select_slotted/generator";
import { initCommercialModelGenerator } from "./init/init_commercial_model/generator";
import { onInitCommercialModelGenerator } from "./on_init/on_init_commercial_model/generator";
import { onSelectCommercialModelGenerator } from "./on_select/on_select_commercial_model/generator";
import { confirmCommercialModelGenerator } from "./confirm/confirm_commercial_model/generator";
import { onConfirmCommercialModelGenerator } from "./on_confirm/on_confirm_commercial_model/generator";
import { issueStatusGenerator } from "./issue/generator";
import { onIssueStatusGenerator } from "./on_issue/generator";
import { onUpdateIgmReturnGenerator } from "./on_update/on_update_return_igm/generator";
import { onUpdateIgmReplacementGenerator } from "./on_update/on_update_replacement_igm/generator";
import { issueStatusGenerator_100 } from "./issue/issue_100/generator";
import { onIssueStatusGenerator_100 } from "./on_issue/on_issue_100/generator";
import { catalog_rejection_generator } from "./on_search/catalog_rejection/generator";

export async function Generator(
  action_id: string,
  existingPayload: any,
  sessionData: any,
  inputs?: any
) {
  switch (action_id) {
    case "search":
      return await searchGenerator(existingPayload, sessionData, inputs);
    case "on_search":
      return await onSearchGenerator(existingPayload, sessionData, inputs);
    case "search_1":
      return await search1Generator(existingPayload, sessionData, inputs);
    case "on_search_1":
      return await onSearch1Generator(existingPayload, sessionData);
    case "on_search_2":
      return await onSearch2Generator(existingPayload, sessionData);
    case "on_search_3":
      return await onSearch3Generator(existingPayload, sessionData);
    case "select":
      return await selectGenerator(existingPayload, sessionData, inputs);
    case "on_select":
      return await onSelectGenerator(existingPayload, sessionData);
    case "select_oos":
      return await selectGenerator(existingPayload, sessionData, inputs);
    case "on_select_oos":
      return await onSelectOOSGenerator(existingPayload, sessionData, inputs);
    case "on_select_multiple_fulfillment":
      return await onSelectMultipleFulfillmentGenerator(
        existingPayload,
        sessionData
      );
    case "on_select_fulfillment_array":
      return await onSelectFulfillmentArrayGenerator(
        existingPayload,
        sessionData
      );
    case "on_select_slotted":
      return await onSelectSlottedGenerator(existingPayload, sessionData);
    case "on_select_commercial_model":
      return await onSelectCommercialModelGenerator(existingPayload, sessionData);
    case "init":
      return await initGenerator(existingPayload, sessionData, inputs);
    case "init_commercial_model":
      return await initCommercialModelGenerator(existingPayload, sessionData, inputs);
    case "init_multiple_fulfillment":
      return await initMultipleFulfillmentGenerator(
        existingPayload,
        sessionData,
        inputs
      );
    case "init_fulfillment_array":
      return await initFulfillmentArrayGenerator(existingPayload, sessionData);
    case "on_init":
      return await onInitGenerator(existingPayload, sessionData);
    case "on_init_commercial_model":
      return await onInitCommercialModelGenerator(existingPayload, sessionData);
    case "on_init_fulfillment_array":
      return await onInitFulfillmentArrayGenerator(
        existingPayload,
        sessionData
      );
    case "confirm":
      return await confirmGenerator(existingPayload, sessionData);
    case "confirm_commercial_model":
      return await confirmCommercialModelGenerator(existingPayload, sessionData);
    case "on_confirm_commercial_model":
      return await onConfirmCommercialModelGenerator(existingPayload, sessionData);
    case "on_confirm":
      return await onConfirmGenerator(existingPayload, sessionData);
    case "on_status_pending":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Pending",
      });
    case "on_status_packed":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Packed",
      }, inputs);
    case "on_status_agent_assigned":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Agent-assigned",
      });
    case "on_status_at_pickup":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "At-pickup",
      }, inputs);
    case "on_status_order_picked":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Order-picked",
      });
    case "on_status_at_delivery":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "At-delivery",
      });
    case "on_status_order_delivered":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Order-delivered",
      });
    case "on_status_self_delivery_picked":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Order-picked-self-delivery",
      });
    case "on_status_rto_disposed":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "RTO-Disposed",
      });
    case "cancel":
      return await cancelGenerator(existingPayload, sessionData);
    case "cancel_force":
      return await cancelForceGenerator(existingPayload, sessionData);
    case "cancel_no":
      return await cancelNoGenerator(existingPayload, sessionData, inputs);
    case "on_cancel":
      return await onCancelGenerator(existingPayload, sessionData, inputs);
    case "on_cancel_rto":
      return await onCancelRTOGenerator(existingPayload, sessionData);
    case "track":
      return await trackGenerator(existingPayload, sessionData);
    case "on_track":
      return await onTrackGenerator(existingPayload, sessionData);
    case "update_address":
      return await updateAddressGenerator(existingPayload, sessionData);
    case "update_buyer_inst":
      return await updateBuyerInstGenerator(existingPayload, sessionData);
    case "update_settelment_cancel":
      return await updateSettlelmentGenerator(
        existingPayload,
        sessionData,
        action_id,
        inputs
      );
    case "update_settelment_return":
      return await updateSettlelmentGenerator(
        existingPayload,
        sessionData,
        action_id
      );
    case "update_settelment_part_cancel":
      return await updateSettlelmentGenerator(
        existingPayload,
        sessionData,
        action_id
      );
    case "update_buyer_delivery_intermin":
      return await updateBuyerDeliveryGenerator(
        existingPayload,
        sessionData,
        action_id
      );
    case "update_buyer_delivery_final":
      return await updateBuyerDeliveryGenerator(
        existingPayload,
        sessionData,
        action_id
      );
    case "update_document":
      return await updateDocumentGenerator(existingPayload, sessionData);
    case "update_return":
      return await updateReturnGenerator(existingPayload, sessionData, inputs);
    case "on_update_address":
      return await onUpdateGenerator(existingPayload, sessionData);
    case "on_update_buyer_inst":
      return await onUpdateGenerator(existingPayload, sessionData);
    case "on_update_delivery_auth":
      return await onUpdateGenerator(existingPayload, {
        ...sessionData,
        deliveryAuth: true,
      });
    case "on_update_part_cancel":
      return await onUpdatePartCancelGenerator(
        existingPayload,
        sessionData,
        inputs
      );
    case "on_update_buyer_delivery_intermin":
      return await onUpdateBuyerDeliveryGenerator(existingPayload, sessionData);
    case "on_update_buyer_delivery_final":
      return await onUpdateBuyerDeliveryGenerator(existingPayload, sessionData);
    case "on_update_return_intermin":
      return await onUpdateReturnGenerator(
        existingPayload,
        sessionData,
        action_id
      );
    case "on_update_return_final":
      return await onUpdateReturnGenerator(
        existingPayload,
        sessionData,
        action_id
      );
    case "issue_open":
      return await issueStatusGenerator(existingPayload, {
        ...sessionData,
        igm_action: "issue_open",
      }, inputs);
    case "issue_escalate":
      return await issueStatusGenerator(existingPayload, {
        ...sessionData,
        igm_action: "issue_escalate",
      }, inputs);  
    case "issue_open_2":
      return await issueStatusGenerator(existingPayload, {
        ...sessionData,
        igm_action: "issue_open_2",
      }, inputs);
		case "on_issue_processing":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_processing",
			});
    case "on_issue_processing_1":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_processing_1",
			});
    case "on_issue_processing_2":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_processing_2",
			});    
		case "on_issue_need_more_info":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_need_more_info",
			});
    case "issue_info_provided":
      return await issueStatusGenerator(existingPayload, {
        ...sessionData,
        igm_action: "issue_info_provided",
      }, inputs);
		case "on_issue_provided":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_provided",
			});
		case "on_issue_resolution":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_resolution",
			});
    case "on_issue_resolution_1":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_resolution_1",
			});
    case "on_issue_resolution_2":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_resolution_2",
			});  
    case "on_issue_resolution_igm_3":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_resolution_igm_3",
			});     
		case "issue_resolution_accept":
			return await issueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "issue_resolution_accept",
			}, inputs);
    case "issue_resolution_accept_igm_3":
			return await issueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "issue_resolution_accept_igm_3",
			}, inputs);  
    case "issue_resolution_reject":
			return await issueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "issue_resolution_reject",
			}, inputs);  
		case "on_issue_resolved":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_resolved",
			}, inputs);
    case "on_issue_resolved_igm_3":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_resolved_igm_3",
			}, inputs);  
		case "issue_close":
			return await issueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "issue_close",
			}, inputs)
    case "issue_close_igm_3":
			return await issueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "issue_close_igm_3",
			}, inputs)  
    case "on_update_igm_return": 
			return await onUpdateIgmReturnGenerator(
        existingPayload,
        sessionData,
        action_id,
      ); 
    case "on_update_igm_replacement":
			return await onUpdateIgmReplacementGenerator(
        existingPayload,
        sessionData,
        action_id,
      ); 
    case "on_status_igm_3":
			return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Order-delivered",
      }); 

      // _____________IGM_1.0.0______________
    case "issue_open_100":
      return await issueStatusGenerator_100(
        existingPayload,
        {
          ...sessionData,
          igm_action: "issue_open",
        },
        inputs
      );
    case "on_issue_processing_100":
      return await onIssueStatusGenerator_100(existingPayload, {
        ...sessionData,
        igm_action: "on_issue_processing",
      });
    case "on_issue_resolved_100":
      return await onIssueStatusGenerator_100(
        existingPayload,
        {
          ...sessionData,
          igm_action: "on_issue_resolved",
        },
        inputs
      );
    case "issue_close_100":
      return await issueStatusGenerator_100(
        existingPayload,
        {
          ...sessionData,
          igm_action: "issue_close",
        },
        inputs
      );
    case "catalog_rejection":
      return catalog_rejection_generator(existingPayload, sessionData);
    default:
      throw new Error(`Invalid request type ${action_id}`);
  }
}