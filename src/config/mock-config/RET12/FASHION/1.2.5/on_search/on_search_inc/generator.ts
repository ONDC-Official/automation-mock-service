import { SessionData } from "../../../../session-types";

export async function on_search_inc_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload.context.city = "*"
	return existingPayload;
}
