import { SessionData } from "../../../../session-types";
import { createFulfillments } from "../../api-objects/fulfillments";
import { createGenericOnStatus } from "../on_status_packed/generator";

export async function on_status_out_for_delivery_force_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const generalPayload = createGenericOnStatus(existingPayload, sessionData);
	generalPayload.message.order.fulfillments = createFulfillments(
		"on_status",
		"on_status_out_for_delivery",
		sessionData,
		generalPayload.message.order.fulfillments
	);
	const tat = sessionData.tat;
	const updatedTime = addDurationToTimestamp(
		existingPayload.context.timestamp,
		tat
	);

	existingPayload.context.timestamp = updatedTime;
	generalPayload.message.order.updated_at = updatedTime;
	
	return generalPayload;
}

export function addDurationToTimestamp(timestampStr: any, durationStr: any) {
  const timestamp = new Date(timestampStr);

  const regex =
    /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
  const matches = durationStr.match(regex);

  if (!matches) {
    throw new Error("Invalid ISO 8601 duration format");
  }

  const [
    ,
    years = 0,
    months = 0,
    weeks = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
  ] = matches.map((v: any) => (v === undefined ? 0 : Number(v)));

  timestamp.setFullYear(timestamp.getFullYear() + years);
  timestamp.setMonth(timestamp.getMonth() + months);

  timestamp.setDate(timestamp.getDate() + weeks * 7 + days);
  timestamp.setHours(timestamp.getHours() + hours);
  timestamp.setMinutes(timestamp.getMinutes() + minutes);
  timestamp.setSeconds(timestamp.getSeconds() + seconds);

  return timestamp.toISOString();
}