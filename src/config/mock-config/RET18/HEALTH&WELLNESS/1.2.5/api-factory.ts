import { search_generator } from "./search/search/generator";
import { on_search_generator } from "./on_search/on_search/generator";

import { search_inc_generator } from "./search/search_inc/generator";
import { on_search_inc_generator } from "./on_search/on_search_inc/generator";
import { on_search_inc_disable_generator } from "./on_search/on_search_inc_disable/generator";

import { select_generator } from "./select/select/generator";
import { on_select_generator } from "./on_select/on_select/generator";
import { init_generator } from "./init/init/generator";
import { on_init_generator } from "./on_init/on_init/generator";
import { confirm_generator } from "./confirm/confirm/generator";
import { on_confirm_generator } from "./on_confirm/on_confirm/generator";
import { on_status_pending_generator } from "./on_status/on_status_pending/generator";
import { on_status_packed_generator } from "./on_status/on_status_packed/generator";
import { on_status_agent_assigned_generator } from "./on_status/on_status_agent_assigned/generator";
import { on_status_picked_generator } from "./on_status/on_status_picked/generator";
import { on_status_out_for_delivery_generator } from "./on_status/on_status_out_for_delivery/generator";
import { on_status_order_delivered_generator } from "./on_status/on_status_order_delivered/generator";
import { on_status_packed_rep_generator } from "./on_status/on_status_packed_rep/generator";
import { on_status_picked_rep_generator } from "./on_status/on_status_picked_rep/generator";
import { on_status_out_for_delivery_rep_generator } from "./on_status/on_status_out_for_delivery_rep/generator";
import { on_status_order_delivered_rep_generator } from "./on_status/on_status_order_delivered_rep/generator";

import { select_out_of_stock_generator } from "./select/select_out_of_stock/generator";
import { on_select_out_of_stock_generator } from "./on_select/on_select_out_of_stock/generator";
import { on_select_slotted_delivery_generator } from "./on_select/on_select_slotted_delivery/generator";
import { init_slotted_delivery_generator } from "./init/init_slotted_delivery/generator";
import { on_init_slotted_delivery_generator } from "./on_init/on_init_slotted_delivery/generator";
import { on_select_self_pickup_generator } from "./on_select/on_select_self_pickup/generator";
import { init_self_pickup_generator } from "./init/init_self_pickup/generator";
import { on_init_self_pickup_generator } from "./on_init/on_init_self_pickup/generator";
import { on_status_self_pickup_packed_generator } from "./on_status/on_status_self_pick_packed/generator";
import { on_status_self_pickup_picked_generator } from "./on_status/on_status_self_pick_picked/generator";

import { cancel_generator } from "./cancel/cancel/generator";
import { cancel_return_request_generator } from "./cancel/cancel_return_request/generator";
import { on_cancel_generator } from "./on_cancel/on_cancel/generator";
import { on_cancel_rto_generator } from "./on_cancel/on_cancel_rto/generator";
import { on_cancel_return_request_generator } from "./on_cancel/on_cancel_return_request/generator";
import { on_status_rto_delivereddisposed_generator } from "./on_status/on_status_rto_delivereddisposed/generator";

import { on_update_part_cancel_generator } from "./on_update/on_update_part_cancel/generator";
import { on_update_interim_reverseQc_generator } from "./on_update/on_update_interim_reverseQc/generator";
import { on_update_approved_generator } from "./on_update/on_update_return_approved/generator";
import { on_update_picked_generator } from "./on_update/on_update_return_picked/generator";
import { on_update_return_delivered_generator } from "./on_update/on_update_return_delivered/generator";

import { update_partial_cancel_settlement_generator } from "./update/update_partial_cancel_settlement/generator";
import { update_reverse_qc_generator } from "./update/update_reverse_qc/generator";
import { update_reverse_qc_settlement_generator } from "./update/update_reverse_qc_settlement/generator";
import { update_buyer_instructions } from "./update/update_buyer_instructions/generator";
import { on_update_buyer_instructions } from "./on_update/on_update_buyer_instructions/generator";
import { update_delivery_address } from "./update/update_delivery_address/generator";
import { on_update_delivery_address } from "./on_update/on_update_delivery_address/generator";
import { on_update_delivery_auth } from "./on_update/on_update_delivery_auth/generator";

import { init_cod_generator } from "./init/init_cod/generator";
import { on_init_cod_generator } from "./on_init/on_init_cod/generator";
import { confirm_cod_generator } from "./confirm/confirm_cod/generator";
import { on_confirm_cod_generator } from "./on_confirm/on_confirm_cod/generator";
import { on_status_order_delivered_cod_generator } from "./on_status/on_status_order_delivered_cod/generator";
import { confirm_seller_cred_generator } from "./confirm/confirm_seller_cred/generator";
import { on_confirm_seller_cred_generator } from "./on_confirm/on_confirm_seller_cred/generator";
import { update_reverse_qc_rep_generator } from "./update/update_reverse_qc_rep/generator";
import { on_update_picked_rep_generator } from "./on_update/on_update_return_picked_rep/generator";
import { cancel_no_generator } from "./cancel/cancel_no/generator";
import { cancel_yes_generator } from "./cancel/cancel_yes/generator";
import { update_settlement_cancel_generator } from "./update/update_settlement_cancel/generator";
import { on_cancel_yes_generator } from "./on_cancel/on_cancel_yes/generator";
import { on_status_out_for_delivery_force_generator } from "./on_status/on_status_out_for_delivery_force/generator";
import { on_select_buyer_delivery_generator } from "./on_select/on_select_buyer_delivery/generator";
import { init_buyer_delivery_generator } from "./init/init_buyer_delivery/generator";
import { on_init_buyer_delivery_generator } from "./on_init/on_init_buyer_delivery/generator";
import { on_status_ready_to_ship_generator } from "./on_status/on_status_ready_to_ship/generator";
import { update_picked_up_generator } from "./update/update_picked_up/generator";
import { update_delivered_generator } from "./update/update_delivered/generator";
import { issueStatusGenerator } from "./issue/generator";
import { onIssueStatusGenerator } from "./on_issue/generator";
import { onUpdateIgmReturnGenerator } from "./on_update/on_update_return_igm/generator";
import { onUpdateIgmReplacementGenerator } from "./on_update/on_update_replacement_igm/generator";

export async function Generator(
  action_id: string,
  existingPayload: any,
  sessionData: any,
  inputs?: any
) {
  console.log("action_id in this with sessionData",action_id,existingPayload,sessionData);
  
  switch (action_id) {
    case "search":
      return search_generator(existingPayload, sessionData);
    case "on_search":
      return on_search_generator(existingPayload, sessionData);
    case "search_inc":
      return search_inc_generator(existingPayload, sessionData);
    case "on_search_inc":
      return on_search_inc_generator(existingPayload, sessionData);
    case "on_search_inc_disable":
      return on_search_inc_disable_generator(existingPayload, sessionData);
    case "select":
      return select_generator(existingPayload, sessionData);
    case "select_offers":
      return select_generator(existingPayload, sessionData);
    case "on_select":
      return on_select_generator(existingPayload, sessionData);
    case "init":
      return init_generator(existingPayload, sessionData);
    case "on_init":
      return on_init_generator(existingPayload, sessionData);
    case "confirm":
      return confirm_generator(existingPayload, sessionData);
    case "on_confirm":
      return on_confirm_generator(existingPayload, sessionData);
    case "on_status_pending":
      return on_status_pending_generator(existingPayload, sessionData);
    case "on_status_packed":
      return on_status_packed_generator(existingPayload, sessionData);
    case "on_status_packed_rep":
      return on_status_packed_rep_generator(existingPayload, sessionData);
    case "on_status_agent_assigned":
      return on_status_agent_assigned_generator(existingPayload, sessionData);
    case "on_status_picked":
      return on_status_picked_generator(existingPayload, sessionData);
    case "on_status_picked_rep":
      return on_status_picked_rep_generator(existingPayload, sessionData);
    case "on_status_out_for_delivery":
      return on_status_out_for_delivery_generator(existingPayload, sessionData);
    case "on_status_out_for_delivery_rep":
      return on_status_out_for_delivery_rep_generator(
        existingPayload,
        sessionData
      );
    case "on_status_order_delivered":
      return on_status_order_delivered_generator(existingPayload, sessionData);
    case "on_status_order_delivered_rep":
      return on_status_order_delivered_rep_generator(
        existingPayload,
        sessionData
      );
    case "on_select_slotted_delivery":
			return on_select_slotted_delivery_generator(existingPayload, sessionData);
		case "init_slotted_delivery":
			return init_slotted_delivery_generator(existingPayload, sessionData);
		case "on_init_slotted_delivery":
			return on_init_slotted_delivery_generator(existingPayload, sessionData);
    case "on_select_buyer_delivery":
			return on_select_buyer_delivery_generator(existingPayload, sessionData);
		case "init_buyer_delivery":
			return init_buyer_delivery_generator(existingPayload, sessionData);
		case "on_init_buyer_delivery":
			return on_init_buyer_delivery_generator(existingPayload, sessionData);
		case "on_status_ready_to_ship":
			return on_status_ready_to_ship_generator(existingPayload, sessionData);
		case "update_picked_up":
			return update_picked_up_generator(existingPayload, sessionData);
		case "update_delivered":
			return update_delivered_generator(existingPayload, sessionData);
    case "on_select_self_pickup":
			return on_select_self_pickup_generator(existingPayload, sessionData);
    case "init_self_pickup":
			return init_self_pickup_generator(existingPayload, sessionData);
		case "on_init_self_pickup":
			return on_init_self_pickup_generator(existingPayload, sessionData);
		case "on_status_self_pick_packed":
			return on_status_self_pickup_packed_generator(
				existingPayload,
				sessionData
			);
		case "on_status_self_pick_picked":
			return on_status_self_pickup_picked_generator(
				existingPayload,
				sessionData
			);
    case "update_buyer_instructions":
			return update_buyer_instructions(existingPayload, sessionData);
		case "on_update_buyer_instructions":
			return on_update_buyer_instructions(existingPayload, sessionData);
		case "update_delivery_address":
			return update_delivery_address(existingPayload, sessionData);
		case "on_update_delivery_address":
			return on_update_delivery_address(existingPayload, sessionData);
		case "on_update_delivery_auth":
			return on_update_delivery_auth(existingPayload, sessionData);
    case "select_out_of_stock":
      return select_out_of_stock_generator(existingPayload, sessionData);
    case "on_select_out_of_stock":
      return on_select_out_of_stock_generator(existingPayload, sessionData);
    case "cancel":
      return cancel_generator(existingPayload, sessionData);
    case "on_cancel":
      return on_cancel_generator(existingPayload, sessionData);
    case "on_cancel_rto":
      return on_cancel_rto_generator(existingPayload, sessionData);
    case "on_status_rto_delivereddisposed":
      return on_status_rto_delivereddisposed_generator(
        existingPayload,
        sessionData
      );
    case "on_update_part_cancel":
      return on_update_part_cancel_generator(existingPayload, sessionData);
    case "update_partial_cancel_settlement":
      return update_partial_cancel_settlement_generator(
        existingPayload,
        sessionData
      );
    case "update_reverse_qc":
      return update_reverse_qc_generator(existingPayload, sessionData);
    case "on_update_interim_reverseQc":
      return on_update_interim_reverseQc_generator(
        existingPayload,
        sessionData
      );
    case "on_update_return_approved":
      return on_update_approved_generator(existingPayload, sessionData);
    case "on_update_return_picked":
      return on_update_picked_generator(existingPayload, sessionData);
    case "update_reverse_qc_settlement":
      return update_reverse_qc_settlement_generator(
        existingPayload,
        sessionData
      );
    case "on_update_return_delivered":
    case "on_update_return_delivered_rep":
      return on_update_return_delivered_generator(existingPayload, sessionData);
    case "cancel_return_request":
      return cancel_return_request_generator(existingPayload, sessionData);
    case "on_cancel_return_request":
      return on_cancel_return_request_generator(existingPayload, sessionData);
    case "init_cod":
      return init_cod_generator(existingPayload, sessionData);
    case "on_init_cod":
      return on_init_cod_generator(existingPayload, sessionData);
    case "confirm_cod":
      return confirm_cod_generator(existingPayload, sessionData);
    case "on_confirm_cod":
      return on_confirm_cod_generator(existingPayload, sessionData);
    case "on_status_order_delivered_cod":
      return on_status_order_delivered_cod_generator(
        existingPayload,
        sessionData
      );
    case "confirm_seller_cred":
      return confirm_seller_cred_generator(existingPayload, sessionData);
    case "on_confirm_seller_cred":
      return on_confirm_seller_cred_generator(existingPayload, sessionData);
    case "update_reverse_qc_rep":
      return update_reverse_qc_rep_generator(existingPayload, sessionData);
    case "on_update_return_picked_rep":
      return on_update_picked_rep_generator(existingPayload, sessionData);
    case "on_status_out_for_delivery_force":
      return on_status_out_for_delivery_force_generator(existingPayload, sessionData);
    case "cancel_no":
      return cancel_no_generator(existingPayload, sessionData);
    case "cancel_yes":
      return cancel_yes_generator(existingPayload, sessionData);
    case "on_cancel_yes":
      return on_cancel_yes_generator(existingPayload, sessionData);
    case "update_settlement_cancel":
      return update_settlement_cancel_generator(existingPayload, sessionData);
        case "issue_open":
      return await issueStatusGenerator(
        existingPayload,
        {
          ...sessionData,
          igm_action: "issue_open",
        },
        inputs
      );
    case "issue_escalate":
      return await issueStatusGenerator(
        existingPayload,
        {
          ...sessionData,
          igm_action: "issue_escalate",
        },
        inputs
      );
    case "issue_open_2":
      return await issueStatusGenerator(
        existingPayload,
        {
          ...sessionData,
          igm_action: "issue_open_2",
        },
        inputs
      );
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
      return await issueStatusGenerator(
        existingPayload,
        {
          ...sessionData,
          igm_action: "issue_info_provided",
        },
        inputs
      );
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
      return await issueStatusGenerator(
        existingPayload,
        {
          ...sessionData,
          igm_action: "issue_resolution_accept",
        },
        inputs
      );
    case "issue_resolution_accept_igm_3":
      return await issueStatusGenerator(
        existingPayload,
        {
          ...sessionData,
          igm_action: "issue_resolution_accept_igm_3",
        },
        inputs
      );
    case "issue_resolution_reject":
      return await issueStatusGenerator(
        existingPayload,
        {
          ...sessionData,
          igm_action: "issue_resolution_reject",
        },
        inputs
      );
    case "on_issue_resolved":
      return await onIssueStatusGenerator(
        existingPayload,
        {
          ...sessionData,
          igm_action: "on_issue_resolved",
        },
        inputs
      );
    case "on_issue_resolved_igm_3":
      return await onIssueStatusGenerator(
        existingPayload,
        {
          ...sessionData,
          igm_action: "on_issue_resolved_igm_3",
        },
        inputs
      );
    case "issue_close":
      return await issueStatusGenerator(
        existingPayload,
        {
          ...sessionData,
          igm_action: "issue_close",
        },
        inputs
      );
    case "issue_close_igm_3":
      return await issueStatusGenerator(
        existingPayload,
        {
          ...sessionData,
          igm_action: "issue_close_igm_3",
        },
        inputs
      );
    case "on_update_igm_return":
      return await onUpdateIgmReturnGenerator(
        existingPayload,
        sessionData,
        action_id
      );
    case "on_update_igm_replacement":
      return await onUpdateIgmReplacementGenerator(
        existingPayload,
        sessionData,
        action_id
      );
    case "on_status_igm_3":
      return on_status_order_delivered_generator(existingPayload, sessionData);
    default:
      console.log(action_id);
      throw new Error("Invalid action id found! ");
  }
}
