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

import { select_out_of_stock_generator } from "./select/select_out_of_stock/generator";
import { on_select_out_of_stock_generator } from "./on_select/on_select_out_of_stock/generator";

import { cancel_generator } from "./cancel/cancel/generator";
import { on_cancel_generator } from "./on_cancel/on_cancel/generator";
import { on_cancel_rto_generator } from "./on_cancel/on_cancel_rto/generator";
import { on_status_rto_delivereddisposed_generator } from "./on_status/on_status_rto_delivereddisposed/generator";
import { on_update_part_cancel_generator } from "./on_update/on_update_part_cancel/generator";

import { update_partial_cancel_settlement_generator } from "./update/update_partial_cancel_settlement/generator";
import { on_init_snp_generator } from "./on_init/on_init_snp/generator";
import { on_init_snp_unsolicited_generator } from "./on_init/on_init_snp_unsolicited/generator";
import { confirm_snp_generator } from "./confirm/confirm_snp/generator";
import { on_init_fin_generator } from "./on_init/on_init_fin/generator";
import { confirm_fin_generator } from "./confirm/confirm_fin/generator";
import { init_fin_generator } from "./init/init_fin/generator";
import { on_status_pending_fin_generator } from "./on_status/on_status_pending_fin/generator";
import { on_status_packed_fin_generator } from "./on_status/on_status_packed_fin/generator";
import { on_status_agent_assigned_fin_generator } from "./on_status/on_status_agent_assigned_fin/generator";
import { on_status_picked_fin_generator } from "./on_status/on_status_picked_fin/generator";
import { on_status_out_for_delivery_fin_generator } from "./on_status/on_status_out_for_delivery_fin/generator";
import { on_status_order_delivered_fin_generator } from "./on_status/on_status_order_delivered_fin/generator";
import { on_confirm_fin_generator } from "./on_confirm/on_confirm_fin/generator";
import { select_input_generator } from "./select/select_input/generator";
import { on_select_input_generator } from "./on_select/on_select_input/generator";
import { on_status_out_for_delivery_force_generator } from "./on_status/on_status_out_for_delivery_force/generator";
import { cancel_no_generator } from "./cancel/cancel_no/generator";
import { cancel_yes_generator } from "./cancel/cancel_yes/generator";
import { on_cancel_yes_generator } from "./on_cancel/on_cancel_yes/generator";
import { update_settlement_cancel_generator } from "./update/update_settlement_cancel/generator";
import { onIssueStatusGenerator } from "./on_issue/generator";
import { issueStatusGenerator } from "./issue/generator";
import { onUpdateIgmReturnGenerator } from "./on_update/on_update_return_igm/generator";
import { onUpdateIgmReplacementGenerator } from "./on_update/on_update_replacement_igm/generator";
import { onIssueStatusGenerator_100 } from "./on_issue/on_issue_100/generator";
import { issueStatusGenerator_100 } from "./issue/issue_100/generator";
import { catalog_rejection_generator } from "./on_search/catalog_rejection/generator";

export async function Generator(
  action_id: string,
  existingPayload: any,
  sessionData: any,
  inputs?: any
) {
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
    case "on_status_agent_assigned":
      return on_status_agent_assigned_generator(existingPayload, sessionData);
    case "on_status_picked":
      return on_status_picked_generator(existingPayload, sessionData);
    case "on_status_out_for_delivery":
      return on_status_out_for_delivery_generator(existingPayload, sessionData);
    case "on_status_order_delivered":
      return on_status_order_delivered_generator(existingPayload, sessionData);
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
    case "on_init_snp":
      return on_init_snp_generator(existingPayload, sessionData);
    case "on_init_snp_unsolicited":
      return on_init_snp_unsolicited_generator(existingPayload, sessionData);
    case "confirm_snp":
      return confirm_snp_generator(existingPayload, sessionData);
    case "init_fin":
      return init_fin_generator(existingPayload, sessionData);
    case "on_init_fin":
      return on_init_fin_generator(existingPayload, sessionData);
    case "confirm_fin":
      return confirm_fin_generator(existingPayload, sessionData);
    case "on_confirm_fin":
      return on_confirm_fin_generator(existingPayload, sessionData);
    case "on_status_pending_fin":
      return on_status_pending_fin_generator(existingPayload, sessionData);
    case "on_status_packed_fin":
      return on_status_packed_fin_generator(existingPayload, sessionData);
    case "on_status_agent_assigned_fin":
      return on_status_agent_assigned_fin_generator(
        existingPayload,
        sessionData
      );
    case "on_status_picked_fin":
      return on_status_picked_fin_generator(existingPayload, sessionData);
    case "on_status_out_for_delivery_fin":
      return on_status_out_for_delivery_fin_generator(
        existingPayload,
        sessionData
      );
    case "on_status_order_delivered_fin":
      return on_status_order_delivered_fin_generator(
        existingPayload,
        sessionData
      );
    case "select_input":
      return select_input_generator(existingPayload, sessionData);
    case "on_select_input":
      return on_select_input_generator(existingPayload, sessionData);
    case "on_status_out_for_delivery_force":
      return on_status_out_for_delivery_force_generator(
        existingPayload,
        sessionData
      );
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
      return await catalog_rejection_generator(existingPayload, sessionData)
    default:
      console.log(action_id);
      throw new Error("Invalid action id found! ");
  }
}
