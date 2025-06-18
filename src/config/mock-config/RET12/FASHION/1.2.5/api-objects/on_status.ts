import e from "express";
import { SessionData } from "../../../session-types";
import { getUpdatedBilling } from "./billing";

export function createGenericOnStatus(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload.message.order.id = sessionData.order_id;
	existingPayload.message.order.provider = sessionData.provider;
	existingPayload.message.order.items = sessionData.items;
	existingPayload.message.order.billing = getUpdatedBilling(
		sessionData.billing
	);
	existingPayload.message.order.quote = sessionData.quote;
	const timeISO = new Date().toISOString();
	existingPayload.message.order.updated_at = timeISO;
	existingPayload.message.order.created_at = sessionData.order_created_at;
	e	
	existingPayload.message.order.payment = sessionData.payment
	return existingPayload;
}
