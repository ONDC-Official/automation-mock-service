// Search imports
import { MockSearch } from "./GROCERY/1.2.5/search/search/mock";
import { MockSearchInc } from "./GROCERY/1.2.5/search/search_inc/mock";
import { MockSelect } from "./GROCERY/1.2.5/select/select/mock";
import { MockSelect122 } from "./GROCERY/1.2.5/select/select_122/mock";
import { MockSelect142 } from "./GROCERY/1.2.5/select/select_142/mock";
import { MockSelectOutOfStock } from "./GROCERY/1.2.5/select/select_out_of_stock/mock";
import { MockInit } from "./GROCERY/1.2.5/init/init/mock";
import { MockInit124 } from "./GROCERY/1.2.5/init/init_124/mock";
import { MockInit131 } from "./GROCERY/1.2.5/init/init_131/mock";
import { MockInit144 } from "./GROCERY/1.2.5/init/init_144/mock";
import { MockInitBuyerDelivery } from "./GROCERY/1.2.5/init/init_buyer_delivery/mock";
import { MockInitCod } from "./GROCERY/1.2.5/init/init_cod/mock";
import { MockInitMultiFulfillment } from "./GROCERY/1.2.5/init/init_multi_fulfillment/mock";
import { MockInitSelfPickup } from "./GROCERY/1.2.5/init/init_self_pickup/mock";
import { MockInitSlottedDelivery } from "./GROCERY/1.2.5/init/init_slotted_delivery/mock";
import { MockConfirm } from "./GROCERY/1.2.5/confirm/confirm/mock";
import { MockConfirm126 } from "./GROCERY/1.2.5/confirm/confirm_126/mock";
import { MockConfirm133 } from "./GROCERY/1.2.5/confirm/confirm_133/mock";
import { MockConfirm146 } from "./GROCERY/1.2.5/confirm/confirm_146/mock";
import { MockConfirmCod } from "./GROCERY/1.2.5/confirm/confirm_cod/mock";
import { MockConfirmMultiFulfillment } from "./GROCERY/1.2.5/confirm/confirm_multi_fulfillment/mock";
import { MockCancel } from "./GROCERY/1.2.5/cancel/cancel/mock";
import { MockTrack } from "./GROCERY/1.2.5/track/track/mock";
import { MockUpdateBuyerInstructions } from "./GROCERY/1.2.5/update/update_buyer_instructions/mock";
import { MockUpdateDelivered } from "./GROCERY/1.2.5/update/update_delivered/mock";
import { MockUpdateDeliveryAddress } from "./GROCERY/1.2.5/update/update_delivery_address/mock";
import { MockUpdateLiquidated } from "./GROCERY/1.2.5/update/update_liquidated/mock";
import { MockUpdateLiquidatedSettlement } from "./GROCERY/1.2.5/update/update_liquidated_settlement/mock";
import { MockUpdatePickedUp } from "./GROCERY/1.2.5/update/update_picked_up/mock";
import { MockUpdateReturn } from "./GROCERY/1.2.5/update/update_return/mock";
import { MockUpdateReverseQc } from "./GROCERY/1.2.5/update/update_reverse_qc/mock";
import { MockUpdateReverseQcSettlement } from "./GROCERY/1.2.5/update/update_reverse_qc_settlement/mock";
import { MockUpdateSettlementTrail } from "./GROCERY/1.2.5/update/update_settlement_trail/mock";
import { MockOnSearch } from "./GROCERY/1.2.5/on_search/on_search/mock";
import { MockOnSearch104 } from "./GROCERY/1.2.5/on_search/on_search_104/mock";
import { MockOnSearch118 } from "./GROCERY/1.2.5/on_search/on_search_118/mock";
import { MockOnSearch121 } from "./GROCERY/1.2.5/on_search/on_search_121/mock";
import { MockOnSearch141 } from "./GROCERY/1.2.5/on_search/on_search_141/mock";
import { MockOnSearchInc } from "./GROCERY/1.2.5/on_search/on_search_inc/mock";
import { MockOnSearchIncClose } from "./GROCERY/1.2.5/on_search/on_search_inc_close/mock";
import { MockOnSearchIncDisable } from "./GROCERY/1.2.5/on_search/on_search_inc_disable/mock";
import { MockOnSearchIncOpen } from "./GROCERY/1.2.5/on_search/on_search_inc_open/mock";
import { MockOnSelect } from "./GROCERY/1.2.5/on_select/on_select/mock";
import { MockOnSelect123 } from "./GROCERY/1.2.5/on_select/on_select_123/mock";
import { MockOnSelect130 } from "./GROCERY/1.2.5/on_select/on_select_130/mock";
import { MockOnSelect143 } from "./GROCERY/1.2.5/on_select/on_select_143/mock";
import { MockOnSelectBuyerDelivery } from "./GROCERY/1.2.5/on_select/on_select_buyer_delivery/mock";
import { MockOnSelectMultiFulfillment } from "./GROCERY/1.2.5/on_select/on_select_multi_fulfillment/mock";
import { MockOnSelectOutOfStock } from "./GROCERY/1.2.5/on_select/on_select_out_of_stock/mock";
import { MockOnSelectSelfPickup } from "./GROCERY/1.2.5/on_select/on_select_self_pickup/mock";
import { MockOnSelectSlottedDelivery } from "./GROCERY/1.2.5/on_select/on_select_slotted_delivery/mock";
import { MockOnInit } from "./GROCERY/1.2.5/on_init/on_init/mock";
import { MockOnInit125 } from "./GROCERY/1.2.5/on_init/on_init_125/mock";
import { MockOnInit132 } from "./GROCERY/1.2.5/on_init/on_init_132/mock";
import { MockOnInit145 } from "./GROCERY/1.2.5/on_init/on_init_145/mock";
import { MockOnInitBuyerDelivery } from "./GROCERY/1.2.5/on_init/on_init_buyer_delivery/mock";
import { MockOnInitCod } from "./GROCERY/1.2.5/on_init/on_init_cod/mock";
import { MockOnInitMultiFulfillment } from "./GROCERY/1.2.5/on_init/on_init_multi_fulfillment/mock";
import { MockOnInitSelfPickup } from "./GROCERY/1.2.5/on_init/on_init_self_pickup/mock";
import { MockOnInitSlottedDelivery } from "./GROCERY/1.2.5/on_init/on_init_slotted_delivery/mock";
import { MockOnConfirm } from "./GROCERY/1.2.5/on_confirm/on_confirm/mock";
import { MockOnConfirm127 } from "./GROCERY/1.2.5/on_confirm/on_confirm_127/mock";
import { MockOnConfirm134 } from "./GROCERY/1.2.5/on_confirm/on_confirm_134/mock";
import { MockOnConfirm147 } from "./GROCERY/1.2.5/on_confirm/on_confirm_147/mock";
import { MockOnConfirmCod } from "./GROCERY/1.2.5/on_confirm/on_confirm_cod/mock";
import { MockOnCancel } from "./GROCERY/1.2.5/on_cancel/on_cancel/mock";
import { MockOnCancelRto } from "./GROCERY/1.2.5/on_cancel/on_cancel_rto/mock";
import { MockOnTrack } from "./GROCERY/1.2.5/on_track/on_track/mock";
import { MockDynOnStatus } from "./GROCERY/1.2.5/on_status/dyn_on_status/mock";
import { MockOnStatusAccepted } from "./GROCERY/1.2.5/on_status/on_status_accepted/mock";
import { MockOnStatusAgentAssigned } from "./GROCERY/1.2.5/on_status/on_status_agent_assigned/mock";
import { MockOnStatusOrderDelivered } from "./GROCERY/1.2.5/on_status/on_status_order_delivered/mock";
import { MockOnStatusOrderDelivered154 } from "./GROCERY/1.2.5/on_status/on_status_order_delivered_154/mock";
import { MockOnStatusOrderDelivered159 } from "./GROCERY/1.2.5/on_status/on_status_order_delivered_159/mock";
import { MockOnStatusOrderDeliveredCod } from "./GROCERY/1.2.5/on_status/on_status_order_delivered_cod/mock";
import { MockOnStatusOutForDelivery } from "./GROCERY/1.2.5/on_status/on_status_out_for_delivery/mock";
import { MockOnStatusOutForDelivery138 } from "./GROCERY/1.2.5/on_status/on_status_out_for_delivery_138/mock";
import { MockOnStatusOutForDelivery153 } from "./GROCERY/1.2.5/on_status/on_status_out_for_delivery_153/mock";
import { MockOnStatusOutForDelivery158 } from "./GROCERY/1.2.5/on_status/on_status_out_for_delivery_158/mock";
import { MockOnStatusPacked } from "./GROCERY/1.2.5/on_status/on_status_packed/mock";
import { MockOnStatusPacked136 } from "./GROCERY/1.2.5/on_status/on_status_packed_136/mock";
import { MockOnStatusPacked151 } from "./GROCERY/1.2.5/on_status/on_status_packed_151/mock";
import { MockOnStatusPacked156 } from "./GROCERY/1.2.5/on_status/on_status_packed_156/mock";
import { MockOnStatusPending } from "./GROCERY/1.2.5/on_status/on_status_pending/mock";
import { MockOnStatusPending150 } from "./GROCERY/1.2.5/on_status/on_status_pending_150/mock";
import { MockOnStatusPending155 } from "./GROCERY/1.2.5/on_status/on_status_pending_155/mock";
import { MockOnStatusPicked } from "./GROCERY/1.2.5/on_status/on_status_picked/mock";
import { MockOnStatusPicked137 } from "./GROCERY/1.2.5/on_status/on_status_picked_137/mock";
import { MockOnStatusPicked152 } from "./GROCERY/1.2.5/on_status/on_status_picked_152/mock";
import { MockOnStatusPicked157 } from "./GROCERY/1.2.5/on_status/on_status_picked_157/mock";
import { MockOnStatusReadyToShip } from "./GROCERY/1.2.5/on_status/on_status_ready_to_ship/mock";
import { MockOnStatusRtoDelivered } from "./GROCERY/1.2.5/on_status/on_status_rto_delivered/mock";
import { MockOnStatusSelfPickPacked } from "./GROCERY/1.2.5/on_status/on_status_self_pick_packed/mock";
import { MockOnStatusSelfPickPicked } from "./GROCERY/1.2.5/on_status/on_status_self_pick_picked/mock";
import { MockOnUpdateApproval } from "./GROCERY/1.2.5/on_update/on_update_approval/mock";
import { MockOnUpdateBuyerInstructions } from "./GROCERY/1.2.5/on_update/on_update_buyer_instructions/mock";
import { MockOnUpdateDeliveryAddress } from "./GROCERY/1.2.5/on_update/on_update_delivery_address/mock";
import { MockOnUpdateDeliveryAuth } from "./GROCERY/1.2.5/on_update/on_update_delivery_auth/mock";
import { MockOnUpdateInterimLiquidated } from "./GROCERY/1.2.5/on_update/on_update_interim_liquidated/mock";
import { MockOnUpdateInterimLiquidated174 } from "./GROCERY/1.2.5/on_update/on_update_interim_liquidated_174/mock";
import { MockOnUpdateInterimReverseQc } from "./GROCERY/1.2.5/on_update/on_update_interim_reverseQc/mock";
import { MockOnUpdateLiquidated } from "./GROCERY/1.2.5/on_update/on_update_liquidated/mock";
import { MockOnUpdateLiquidated175 } from "./GROCERY/1.2.5/on_update/on_update_liquidated_175/mock";
import { MockOnUpdatePartCancel } from "./GROCERY/1.2.5/on_update/on_update_part_cancel/mock";
import { MockOnUpdatePicked172 } from "./GROCERY/1.2.5/on_update/on_update_picked_172/mock";
import { MockOnUpdateReturnApproved } from "./GROCERY/1.2.5/on_update/on_update_return_approved/mock";
import { MockOnUpdateReturnDelivered } from "./GROCERY/1.2.5/on_update/on_update_return_delivered/mock";
import { MockOnUpdateReturnDelivered173 } from "./GROCERY/1.2.5/on_update/on_update_return_delivered_173/mock";
import { MockOnUpdateReturnInit } from "./GROCERY/1.2.5/on_update/on_update_return_init/mock";
import { MockOnUpdateReturnPicked } from "./GROCERY/1.2.5/on_update/on_update_return_picked/mock";
import { MockCancelForce } from "./GROCERY/1.2.5/cancel/cancel_force/mock";
import { MockOnCancelForce } from "./GROCERY/1.2.5/on_cancel/on_cancel_force/mock";


export function getMockAction(actionId: string) {
	console.log('actionId', actionId)
	switch (actionId) {
		case "search":
			return new MockSearch();
		case "search_inc":
			return new MockSearchInc();

		case "select":
			return new MockSelect();
		case "select_122":
			return new MockSelect122();
		case "select_142":
			return new MockSelect142();
		case "select_out_of_stock":
			return new MockSelectOutOfStock();

		case "init":
			return new MockInit();
		case "init_124":
			return new MockInit124();
		case "init_131":
			return new MockInit131();
		case "init_144":
			return new MockInit144();
		case "init_buyer_delivery":
			return new MockInitBuyerDelivery();
		case "init_cod":
			return new MockInitCod();
		case "init_multi_fulfillment":
			return new MockInitMultiFulfillment();
		case "init_self_pickup":
			return new MockInitSelfPickup();
		case "init_slotted_delivery":
			return new MockInitSlottedDelivery();

		case "confirm":
			return new MockConfirm();
		case "confirm_126":
			return new MockConfirm126();
		case "confirm_133":
			return new MockConfirm133();
		case "confirm_146":
			return new MockConfirm146();
		case "confirm_cod":
			return new MockConfirmCod();
		case "confirm_multi_fulfillment":
			return new MockConfirmMultiFulfillment();

		case "cancel":
			return new MockCancel();
		case "cancel_force":
			return new MockCancelForce();
		case "track":
			return new MockTrack();

		case "update_buyer_instructions":
			return new MockUpdateBuyerInstructions();
		case "update_delivered":
			return new MockUpdateDelivered();
		case "update_delivery_address":
			return new MockUpdateDeliveryAddress();
		case "update_liquidated":
			return new MockUpdateLiquidated();
		case "update_liquidated_settlement":
			return new MockUpdateLiquidatedSettlement();
		case "update_picked_up":
			return new MockUpdatePickedUp();
		case "update_return":
			return new MockUpdateReturn();
		case "update_reverse_qc":
			return new MockUpdateReverseQc();
		case "update_reverse_qc_settlement":
			return new MockUpdateReverseQcSettlement();
		case "update_settlement_trail":
			return new MockUpdateSettlementTrail();

		case "on_search":
			return new MockOnSearch();
		case "on_search_104":
			return new MockOnSearch104();
		case "on_search_118":
			return new MockOnSearch118();
		case "on_search_121":
			return new MockOnSearch121();
		case "on_search_141":
			return new MockOnSearch141();
		case "on_search_inc":
			return new MockOnSearchInc();
		case "on_search_inc_close":
			return new MockOnSearchIncClose();
		case "on_search_inc_disable":
			return new MockOnSearchIncDisable();
		case "on_search_inc_open":
			return new MockOnSearchIncOpen();

		case "on_select":
			return new MockOnSelect();
		case "on_select_123":
			return new MockOnSelect123();
		case "on_select_130":
			return new MockOnSelect130();
		case "on_select_143":
			return new MockOnSelect143();
		case "on_select_buyer_delivery":
			return new MockOnSelectBuyerDelivery();
		case "on_select_multi_fulfillment":
			return new MockOnSelectMultiFulfillment();
		case "on_select_out_of_stock":
			return new MockOnSelectOutOfStock();
		case "on_select_self_pickup":
			return new MockOnSelectSelfPickup();
		case "on_select_slotted_delivery":
			return new MockOnSelectSlottedDelivery();

		case "on_init":
			return new MockOnInit();
		case "on_init_125":
			return new MockOnInit125();
		case "on_init_132":
			return new MockOnInit132();
		case "on_init_145":
			return new MockOnInit145();
		case "on_init_buyer_delivery":
			return new MockOnInitBuyerDelivery();
		case "on_init_cod":
			return new MockOnInitCod();
		case "on_init_multi_fulfillment":
			return new MockOnInitMultiFulfillment();
		case "on_init_self_pickup":
			return new MockOnInitSelfPickup();
		case "on_init_slotted_delivery":
			return new MockOnInitSlottedDelivery();

		case "on_confirm":
			return new MockOnConfirm();
		case "on_confirm_127":
			return new MockOnConfirm127();
		case "on_confirm_134":
			return new MockOnConfirm134();
		case "on_confirm_147":
			return new MockOnConfirm147();
		case "on_confirm_cod":
			return new MockOnConfirmCod();

		case "on_cancel":
			return new MockOnCancel();
		case "on_cancel_rto":
			return new MockOnCancelRto();
		case "on_cancel_force":
			return new MockOnCancelForce();

		case "on_track":
			return new MockOnTrack();

		case "dyn_on_status":
			return new MockDynOnStatus();
		case "on_status_accepted":
			return new MockOnStatusAccepted();
		case "on_status_agent_assigned":
			return new MockOnStatusAgentAssigned();
		case "dyn_on_status_agent_assigned_0":
			return new MockOnStatusAgentAssigned();
		case "dyn_on_status_agent_assigned_1":
			return new MockOnStatusAgentAssigned();
		case "on_status_order_delivered":
			return new MockOnStatusOrderDelivered();
		case "dyn_on_status_order_delivered_0":
			return new MockOnStatusOrderDelivered();
		case "dyn_on_status_order_delivered_1":
			return new MockOnStatusOrderDelivered();
		case "on_status_order_delivered_154":
			return new MockOnStatusOrderDelivered154();
		case "on_status_order_delivered_159":
			return new MockOnStatusOrderDelivered159();
		case "on_status_order_delivered_cod":
			return new MockOnStatusOrderDeliveredCod();
		case "on_status_out_for_delivery":
			return new MockOnStatusOutForDelivery();
		case "dyn_on_status_out_for_delivery_0":
			return new MockOnStatusOutForDelivery();
		case "dyn_on_status_out_for_delivery_1":
			return new MockOnStatusOutForDelivery();
		case "on_status_out_for_delivery_138":
			return new MockOnStatusOutForDelivery138();
		case "on_status_out_for_delivery_153":
			return new MockOnStatusOutForDelivery153();
		case "on_status_out_for_delivery_158":
			return new MockOnStatusOutForDelivery158();
		case "on_status_packed":
			return new MockOnStatusPacked();
		case "dyn_on_status_packed_0":
			return new MockOnStatusPacked();
		case "dyn_on_status_packed_1":
			return new MockOnStatusPacked();
		case "on_status_packed_136":
			return new MockOnStatusPacked136();
		case "on_status_packed_151":
			return new MockOnStatusPacked151();
		case "on_status_packed_156":
			return new MockOnStatusPacked156();
		case "on_status_pending":
			return new MockOnStatusPending();
		case "on_status_pending_150":
			return new MockOnStatusPending150();
		case "on_status_pending_155":
			return new MockOnStatusPending155();
		case "on_status_picked":
			return new MockOnStatusPicked();
		case "dyn_on_status_picked_0":
			return new MockOnStatusPicked();
		case "dyn_on_status_picked_1":
			return new MockOnStatusPicked();
		case "on_status_picked_137":
			return new MockOnStatusPicked137();
		case "on_status_picked_152":
			return new MockOnStatusPicked152();
		case "on_status_picked_157":
			return new MockOnStatusPicked157();
		case "on_status_ready_to_ship":
			return new MockOnStatusReadyToShip();
		case "on_status_rto_delivered":
			return new MockOnStatusRtoDelivered();
		case "on_status_self_pick_packed":
			return new MockOnStatusSelfPickPacked();
		case "on_status_self_pick_picked":
			return new MockOnStatusSelfPickPicked();

		case "on_update_approval":
			return new MockOnUpdateApproval();
		case "on_update_buyer_instructions":
			return new MockOnUpdateBuyerInstructions();
		case "on_update_delivery_address":
			return new MockOnUpdateDeliveryAddress();
		case "on_update_delivery_auth":
			return new MockOnUpdateDeliveryAuth();
		case "on_update_interim_liquidated":
			return new MockOnUpdateInterimLiquidated();
		case "on_update_interim_liquidated_174":
			return new MockOnUpdateInterimLiquidated174();
		case "on_update_interim_reverseQc":
			return new MockOnUpdateInterimReverseQc();
		case "on_update_liquidated":
			return new MockOnUpdateLiquidated();
		case "on_update_liquidated_175":
			return new MockOnUpdateLiquidated175();
		case "on_update_part_cancel":
			return new MockOnUpdatePartCancel();
		case "on_update_picked_172":
			return new MockOnUpdatePicked172();
		case "on_update_return_approved":
			return new MockOnUpdateReturnApproved();
		case "on_update_return_delivered":
			return new MockOnUpdateReturnDelivered();
		case "on_update_return_delivered_173":
			return new MockOnUpdateReturnDelivered173();
		case "on_update_return_init":
			return new MockOnUpdateReturnInit();
		case "on_update_return_picked":
			return new MockOnUpdateReturnPicked();

		default:
			throw new Error(`Action with ID ${actionId} not found`);
	}
}
