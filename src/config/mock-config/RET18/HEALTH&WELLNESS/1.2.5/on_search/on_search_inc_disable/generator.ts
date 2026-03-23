import { SessionData } from "../../../../session-types";
import { updateTimestamps } from "../../api-objects/utils";
export async function on_search_inc_disable_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload.context.city = "*"
	existingPayload = updateTimestamps(existingPayload);
	return existingPayload;
}
