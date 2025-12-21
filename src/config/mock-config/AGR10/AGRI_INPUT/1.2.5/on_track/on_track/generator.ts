import { SessionData } from "../../../../session-types";

export async function on_track_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	// const isoTime = new Date().toISOString();
	// existingPayload.message.tracking.location.time.timestamp = isoTime;
	// existingPayload.message.tracking.location.updated_at = isoTime;
	return existingPayload;
}
