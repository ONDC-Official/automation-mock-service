import { search_generator } from "./search/search/generator";
import { on_search_generator } from "./on_search/on_search/generator";
import { search_inc_generator } from "./search/search_inc/generator";
import { on_search_inc_generator } from "./on_search/on_search_inc/generator";
import { on_search_104_generator } from "./on_search/on_search_104/generator";
import { select_generator } from "./select/select/generator";
import { on_select_generator } from "./on_select/on_select/generator";
import { init_generator } from "./init/init/generator";
import { on_init_generator } from "./on_init/on_init/generator";
import { confirm_generator } from "./confirm/confirm/generator";
import { on_confirm_generator } from "./on_confirm/on_confirm/generator";
import { on_status_packed_generator } from "./on_status/on_status_packed/generator";
import { on_status_agent_assigned_generator } from "./on_status/on_status_agent_assigned/generator";
import { on_status_picked_generator } from "./on_status/on_status_picked/generator";
import { on_status_out_for_delivery_generator } from "./on_status/on_status_out_for_delivery/generator";
import { on_status_order_delivered_generator } from "./on_status/on_status_order_delivered/generator";
import { track_generator } from "./track/track/generator";
import { on_track_generator } from "./on_track/on_track/generator";
import { on_search_118_generator } from "./on_search/on_search_118/generator";
import { select_out_of_stock_generator } from "./select/select_out_of_stock/generator";
import { on_select_out_of_stock_generator } from "./on_select/on_select_out_of_stock/generator";
import { on_search_121_generator } from "./on_search/on_search_121/generator";
import { select_122_generator } from "./select/select_122/generator";
import { on_select_123_generator } from "./on_select/on_select_123/generator";
import { init_124_generator } from "./init/init_124/generator";
import { on_init_125_generator } from "./on_init/on_init_125/generator";
import { confirm_126_generator } from "./confirm/confirm_126/generator";
import { on_confirm_127_generator } from "./on_confirm/on_confirm_127/generator";
import { cancel_generator } from "./cancel/cancel/generator";
import { on_cancel_generator } from "./on_cancel/on_cancel/generator";
import { on_select_130_generator } from "./on_select/on_select_130/generator";
import { init_131_generator } from "./init/init_131/generator";
import { on_init_132_generator } from "./on_init/on_init_132/generator";
import { confirm_133_generator } from "./confirm/confirm_133/generator";
import { on_confirm_134_generator } from "./on_confirm/on_confirm_134/generator";
import { on_status_pending_generator } from "./on_status/on_status_pending/generator";
import { on_status_packed_136_generator } from "./on_status/on_status_packed_136/generator";
import { on_status_picked_137_generator } from "./on_status/on_status_picked_137/generator";
import { on_status_out_for_delivery_138_generator } from "./on_status/on_status_out_for_delivery_138/generator";
import { on_cancel_rto_generator } from "./on_cancel/on_cancel_rto/generator";
import { on_status_rto_delivereddisposed_generator } from "./on_status/on_status_rto_delivered/generator";
import { on_search_141_generator } from "./on_search/on_search_141/generator";
import { select_142_generator } from "./select/select_142/generator";
import { on_select_143_generator } from "./on_select/on_select_143/generator";
import { init_144_generator } from "./init/init_144/generator";
import { on_init_145_generator } from "./on_init/on_init_145/generator";
import { confirm_146_generator } from "./confirm/confirm_146/generator";
import { on_confirm_147_generator } from "./on_confirm/on_confirm_147/generator";
import { on_update_part_cancel_generator } from "./on_update/on_update_part_cancel/generator";
import { update_partial_cancel_settlement_generator } from "./update/update_settlement_trail/generator";
import { on_status_pending_150_generator } from "./on_status/on_status_pending_150/generator";
import { on_status_packed_151_generator } from "./on_status/on_status_packed_151/generator";
import { on_status_picked_152_generator } from "./on_status/on_status_picked_152/generator";
import { on_status_out_for_delivery_153_generator } from "./on_status/on_status_out_for_delivery_153/generator";
import { on_status_order_delivered_154_generator } from "./on_status/on_status_order_delivered_154/generator";
import { on_status_pending_155_generator } from "./on_status/on_status_pending_155/generator";
import { on_status_packed_156_generator } from "./on_status/on_status_packed_156/generator";
import { on_status_picked_157_generator } from "./on_status/on_status_picked_157/generator";
import { on_status_out_for_delivery_158_generator } from "./on_status/on_status_out_for_delivery_158/generator";
import { on_status_order_delivered_159_generator } from "./on_status/on_status_order_delivered_159/generator";
import { update_liquidated_generator } from "./update/update_liquidated/generator";
import { on_update_interim_liquidated_generator } from "./on_update/on_update_interim_liquidated/generator";
import { on_update_liquidated_generator } from "./on_update/on_update_liquidated/generator";
import { update_liquidated_settlement_generator } from "./update/update_liquidated_settlement/generator";
import { update_reverse_qc_generator } from "./update/update_reverse_qc/generator";
import { on_update_interim_reverseQc_generator } from "./on_update/on_update_interim_reverseQc/generator";
import { on_update_approved_generator } from "./on_update/on_update_return_approved/generator";
import { on_update_picked_generator } from "./on_update/on_update_return_picked/generator";
import { update_reverse_qc_settlement_generator } from "./update/update_reverse_qc_settlement/generator";
import { on_update_return_delivered_generator } from "./on_update/on_update_return_delivered/generator";
import { on_update_interim_reverse_qc_generator } from "./on_update/on_update_return_init/generator";
import { on_update_approval_generator } from "./on_update/on_update_approval/generator";
import { on_update_picked_172_generator } from "./on_update/on_update_picked_172/generator";
import { on_update_return_delivered_173_generator } from "./on_update/on_update_return_delivered_173/generator";
import { on_update_interim_liquidated_174_generator } from "./on_update/on_update_interim_liquidated_174/generator";
import { on_update_liquidated_175_generator } from "./on_update/on_update_liquidated_175/generator";
import { on_search_inc_disable_generator } from "./on_search/on_search_inc_disable/generator";
import { on_status_accepted_generator } from "./on_status/on_status_accepted/generator";
import { update_return } from "./update/update_return/generator";
import { on_search_inc_open } from "./on_search/on_search_inc_open/generator";
import { on_search_inc_close } from "./on_search/on_search_inc_close/generator";
import { init_cod_generator } from "./init/init_cod/generator";
import { on_init_cod_generator } from "./on_init/on_init_cod/generator";
import { confirm_cod_generator } from "./confirm/confirm_cod/generator";
import { on_confirm_cod_generator } from "./on_confirm/on_confirm_cod/generator";
import { on_status_order_delivered_cod_generator } from "./on_status/on_status_order_delivered_cod/generator";
import { on_select_buyer_delivery_generator } from "./on_select/on_select_buyer_delivery/generator";
import { init_buyer_delivery_generator } from "./init/init_buyer_delivery/generator";
import { on_init_buyer_delivery_generator } from "./on_init/on_init_buyer_delivery/generator";
import { on_status_ready_to_ship_generator } from "./on_status/on_status_ready_to_ship/generator";
import { update_picked_up_generator } from "./update/update_picked_up/generator";
import { update_delivered_generator } from "./update/update_delivered/generator";
import { on_select_multi_fulfillment_generator } from "./on_select/on_select_multi_fulfillment/generator";
import { init_multi_fulfillment_generator } from "./init/init_multi_fulfillment/generator";
import { on_init_multi_fulfillment_generator } from "./on_init/on_init_multi_fulfillment/generator";
import { dyn_on_status_generator } from "./on_status/dyn_on_status/generator";
import { confirm_multi_fulfillment_generator } from "./confirm/confirm_multi_fulfillment/generator";
import { update_buyer_instructions } from "./update/update_buyer_instructions/generator";
import { on_update_buyer_instructions } from "./on_update/on_update_buyer_instructions/generator";
import { update_delivery_address } from "./update/update_delivery_address/generator";
import { on_update_delivery_address } from "./on_update/on_update_delivery_address/generator";
import { on_update_delivery_auth } from "./on_update/on_update_delivery_auth/generator";
import { on_select_slotted_delivery_generator } from "./on_select/on_select_slotted_delivery/generator";
import { init_slotted_delivery_generator } from "./init/init_slotted_delivery/generator";
import { on_init_slotted_delivery_generator } from "./on_init/on_init_slotted_delivery/generator";
import { on_select_self_pickup_generator } from "./on_select/on_select_self_pickup/generator";
import { init_self_pickup_generator } from "./init/init_self_pickup/generator";
import { on_init_self_pickup_generator } from "./on_init/on_init_self_pickup/generator";
import { on_status_self_pickup_packed_generator } from "./on_status/on_status_self_pick_packed/generator";
import { on_status_self_pickup_picked_generator } from "./on_status/on_status_self_pick_picked/generator";

export async function Generator(
	action_id: string,
	existingPayload: any,
	sessionData: any
) {
	if (action_id.includes("dyn_on_status")) {
		return dyn_on_status_generator(existingPayload, sessionData);
	}
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
		case "on_search_104":
			return on_search_104_generator(existingPayload, sessionData);
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
		case "track":
			return track_generator(existingPayload, sessionData);
		case "on_track":
			return on_track_generator(existingPayload, sessionData);
		case "on_search_118":
			return on_search_118_generator(existingPayload, sessionData);
		case "select_out_of_stock":
			return select_out_of_stock_generator(existingPayload, sessionData);
		case "on_select_out_of_stock":
			return on_select_out_of_stock_generator(existingPayload, sessionData);
		case "on_search_121":
			return on_search_121_generator(existingPayload, sessionData);
		case "select_122":
			return select_122_generator(existingPayload, sessionData);
		case "on_select_123":
			return on_select_123_generator(existingPayload, sessionData);
		case "init_124":
			return init_124_generator(existingPayload, sessionData);
		case "on_init_125":
			return on_init_125_generator(existingPayload, sessionData);
		case "confirm_126":
			return confirm_126_generator(existingPayload, sessionData);
		case "on_confirm_127":
			return on_confirm_127_generator(existingPayload, sessionData);
		case "cancel":
			return cancel_generator(existingPayload, sessionData);
		case "on_cancel":
			return on_cancel_generator(existingPayload, sessionData);
		case "on_select_130":
			return on_select_130_generator(existingPayload, sessionData);
		case "init_131":
			return init_131_generator(existingPayload, sessionData);
		case "on_init_132":
			return on_init_132_generator(existingPayload, sessionData);
		case "confirm_133":
			return confirm_133_generator(existingPayload, sessionData);
		case "on_confirm_134":
			return on_confirm_134_generator(existingPayload, sessionData);
		case "on_status_pending":
			return on_status_pending_generator(existingPayload, sessionData);
		case "on_status_packed_136":
			return on_status_packed_136_generator(existingPayload, sessionData);
		case "on_status_picked_137":
			return on_status_picked_137_generator(existingPayload, sessionData);
		case "on_status_out_for_delivery_138":
			return on_status_out_for_delivery_138_generator(
				existingPayload,
				sessionData
			);
		case "on_cancel_rto":
			return on_cancel_rto_generator(existingPayload, sessionData);
		case "on_status_rto_delivereddisposed":
			return on_status_rto_delivereddisposed_generator(
				existingPayload,
				sessionData
			);
		case "on_search_141":
			return on_search_141_generator(existingPayload, sessionData);
		case "select_142":
			return select_142_generator(existingPayload, sessionData);
		case "on_select_143":
			return on_select_143_generator(existingPayload, sessionData);
		case "init_144":
			return init_144_generator(existingPayload, sessionData);
		case "on_init_145":
			return on_init_145_generator(existingPayload, sessionData);
		case "confirm_146":
			return confirm_146_generator(existingPayload, sessionData);
		case "on_confirm_147":
			return on_confirm_147_generator(existingPayload, sessionData);
		case "on_update_part_cancel":
			return on_update_part_cancel_generator(existingPayload, sessionData);
		case "update_settlement_trail":
			return update_partial_cancel_settlement_generator(
				existingPayload,
				sessionData
			);
		case "on_status_pending_150":
			return on_status_pending_150_generator(existingPayload, sessionData);
		case "on_status_packed_151":
			return on_status_packed_151_generator(existingPayload, sessionData);
		case "on_status_picked_152":
			return on_status_picked_152_generator(existingPayload, sessionData);
		case "on_status_out_for_delivery_153":
			return on_status_out_for_delivery_153_generator(
				existingPayload,
				sessionData
			);
		case "on_status_order_delivered_154":
			return on_status_order_delivered_154_generator(
				existingPayload,
				sessionData
			);
		case "on_status_pending_155":
			return on_status_pending_155_generator(existingPayload, sessionData);
		case "on_status_packed_156":
			return on_status_packed_156_generator(existingPayload, sessionData);
		case "on_status_picked_157":
			return on_status_picked_157_generator(existingPayload, sessionData);
		case "on_status_out_for_delivery_158":
			return on_status_out_for_delivery_158_generator(
				existingPayload,
				sessionData
			);
		case "on_status_order_delivered_159":
			return on_status_order_delivered_159_generator(
				existingPayload,
				sessionData
			);
		case "update_liquidated":
			return update_liquidated_generator(existingPayload, sessionData);
		case "on_update_interim_liquidated":
			return on_update_interim_liquidated_generator(
				existingPayload,
				sessionData
			);
		case "on_update_liquidated":
			return on_update_liquidated_generator(existingPayload, sessionData);
		case "update_liquidated_settlement":
			return update_liquidated_settlement_generator(
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
			return on_update_return_delivered_generator(existingPayload, sessionData);
		case "on_update_return_init":
			return on_update_interim_reverse_qc_generator(
				existingPayload,
				sessionData
			);
		case "on_update_approval":
			return on_update_approval_generator(existingPayload, sessionData);
		case "on_update_picked_172":
			return on_update_picked_172_generator(existingPayload, sessionData);
		case "on_update_return_delivered_173":
			return on_update_return_delivered_173_generator(
				existingPayload,
				sessionData
			);
		case "on_update_interim_liquidated_174":
			return on_update_interim_liquidated_174_generator(
				existingPayload,
				sessionData
			);
		case "on_update_liquidated_175":
			return on_update_liquidated_175_generator(existingPayload, sessionData);
		case "on_status_accepted":
			return on_status_accepted_generator(existingPayload, sessionData);
		case "on_status_rto_delivered":
			return on_status_rto_delivereddisposed_generator(
				existingPayload,
				sessionData
			);
		case "update_return":
			return update_return(existingPayload, sessionData);
		case "on_search_inc_open":
			return on_search_inc_open(existingPayload, sessionData);
		case "on_search_inc_close":
			return on_search_inc_close(existingPayload, sessionData);
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
		case "on_select_multi_fulfillment":
			return on_select_multi_fulfillment_generator(
				existingPayload,
				sessionData
			);
		case "init_multi_fulfillment":
			return init_multi_fulfillment_generator(existingPayload, sessionData);
		case "on_init_multi_fulfillment":
			return on_init_multi_fulfillment_generator(existingPayload, sessionData);
		case "confirm_multi_fulfillment":
			return confirm_multi_fulfillment_generator(existingPayload, sessionData);
		case "update_buyer_instructions":
			return update_buyer_instructions(existingPayload,sessionData)
		case "on_update_buyer_instructions":
			return on_update_buyer_instructions(existingPayload,sessionData)
		case "update_delivery_address":
			return update_delivery_address(existingPayload,sessionData)
		case "on_update_delivery_address":
			return on_update_delivery_address(existingPayload,sessionData)
		case "on_update_delivery_auth":
			return on_update_delivery_auth(existingPayload,sessionData)
		case "on_select_slotted_delivery":
			return on_select_slotted_delivery_generator(existingPayload,sessionData)
		case "init_slotted_delivery":
			return init_slotted_delivery_generator(existingPayload,sessionData)
		case "on_init_slotted_delivery":
			return on_init_slotted_delivery_generator(existingPayload,sessionData)
		case "on_select_self_pickup":
			return on_select_self_pickup_generator(existingPayload,sessionData)
		case "init_self_pickup":
			return init_self_pickup_generator(existingPayload,sessionData)
		case "on_init_self_pickup":
			return on_init_self_pickup_generator(existingPayload,sessionData)
		case "on_status_self_pick_packed":
			return on_status_self_pickup_packed_generator(existingPayload,sessionData)
		case "on_status_self_pick_picked":
			return on_status_self_pickup_picked_generator(existingPayload,sessionData)
		default:
			console.log(action_id);
			throw new Error("Invalid action id found! ");
	}
}
