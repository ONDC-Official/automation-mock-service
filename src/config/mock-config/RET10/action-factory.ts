import { MockSearch } from "./GROCERY/1.2.5/search/search/mock";

export function getMockAction(actionId: string) {
	switch (actionId) {
		case "search":
			return new MockSearch();
		default:
			throw new Error(`Action with ID ${actionId} not found`);
	}
}
