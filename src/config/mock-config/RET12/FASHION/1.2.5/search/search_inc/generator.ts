import { SessionData } from "../../../../session-types";

export async function search_inc_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	delete existingPayload.context.bpp_uri;
	delete existingPayload.context.bpp_id;
	if (sessionData.inc_mode) {
		existingPayload.message.intent.tags[0].list[0].value = "stop";
	}
	return existingPayload;
}
