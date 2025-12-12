import { SessionData } from "../../../session-types";

export async function search_city_based_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	delete existingPayload.context.bpp_uri;
	delete existingPayload.context.bpp_id;

	// start and end date
	// const currentTimeStamp = new Date(existingPayload.context.timestamp);
	// console.log("currentTimeStamp", currentTimeStamp);
	// existingPayload.message.intent.fulfillment.stops[0].time.range.start = currentTimeStamp.toISOString();
	// console.log("start date", existingPayload.message.intent.fulfillment.stops[0].time.range.start);
	// const endDate = new Date(currentTimeStamp);
	// endDate.setDate(endDate.getDate() + 2);
	// console.log("end date", endDate.toISOString());
	// existingPayload.message.intent.fulfillment.stops[0].time.range.end = endDate.toISOString();
	// console.log("end date", existingPayload.message.intent.fulfillment.stops[0].time.range.end);
	return existingPayload;
} 