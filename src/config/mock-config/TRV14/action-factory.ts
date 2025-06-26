import { MockSearchTRV14 } from "./2.0.0/search/mock";

export function getMockAction(actionId: string) {
	switch (actionId) {
		case "search_seller_pagination":
			return new MockSearchTRV14();
		case "on_search_seller_pagination_1":
			return new MockSearchTRV14();
		case "on_search_seller_pagination_2":
			return new MockSearchTRV14();
		default:
			throw new Error(`Action with ID ${actionId} not found`);
	}
} 