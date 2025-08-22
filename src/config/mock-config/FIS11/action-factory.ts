
// on_search
import { MockOnSearchMetroCardRechargeClass } from "./2.0.0/on_search/on_search_metro_card_recharge/class";

export function getMockAction(actionId: string) {
	switch (actionId) {
		case "search_seller_pagination":
			return new MockOnSearchMetroCardRechargeClass();
		default:
			throw new Error(`Action with ID ${actionId} not found`);
	}
} 