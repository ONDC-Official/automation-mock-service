import e from "express";
import { SessionData } from "../../../session-types";
import { getUpdatedBilling } from "./billing";
import { removeItemQuantitiesFromQuote } from "./quote";

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
  existingPayload.message.order.quote = removeItemQuantitiesFromQuote(
    sessionData.quote
  );
  existingPayload.message.order.quote = sessionData.quote;
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;
  existingPayload.message.order.created_at = sessionData.order_created_at;
  existingPayload.message.order.payment = sessionData.payment;
  return existingPayload;
}
