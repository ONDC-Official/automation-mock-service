import { SessionData } from "../../../../session-types";
import { RET10GROCERY125Catalog } from "../catalog";

export async function on_search_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload.message = RET10GROCERY125Catalog;
	return existingPayload;
}
