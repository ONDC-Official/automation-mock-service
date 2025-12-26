import { SessionData } from "../../../session-types";

export async function on_track_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const currentTimestamp = existingPayload.context.timestamp;

	existingPayload.message.tracking.location.time.timestamp = currentTimestamp;
	existingPayload.message.tracking.location.updated_at = currentTimestamp;
	return existingPayload;
};
