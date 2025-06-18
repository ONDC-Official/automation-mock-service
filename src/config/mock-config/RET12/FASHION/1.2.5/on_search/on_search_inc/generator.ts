import { SessionData } from "../../../../session-types";
import { updateTimestamps } from "../../api-objects/utils";
export async function on_search_inc_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload = updateTimestamps(existingPayload);
	existingPayload.context.city = "*"
	return existingPayload;
}
