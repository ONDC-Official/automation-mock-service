import { SessionData } from "../../../session-types";

export const confirmGenerator = (
  existingPayload: any,
  sessionData: SessionData
) => {
  if (sessionData.fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
  }

  // Replace items if provided in session
  if (sessionData.items) {
    existingPayload.message.order.items = sessionData.items;
  }

  // Replace payment if session has it
  if (sessionData.payment) {
    existingPayload.message.order.payment = sessionData.payment;
  }

  // Replace quote if session has updated price breakdown
  if (sessionData.quote) {
    existingPayload.message.order.quote = sessionData.quote;
  }

  // Optional: update provider or other sections if sessionData includes them
  // if (sessionData.provider) {
  //   existingPayload.order.provider = sessionData.provider;
  // }

  return existingPayload;
};