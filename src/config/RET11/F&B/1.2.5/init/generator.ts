import { SessionData } from "../../../session-types";
  
export async function initGenerator(existingPayload: any, sessionData: SessionData) {
  // Replace fulfillments with the session data
  existingPayload.message.order.fulfillments = sessionData.fulfillments;

  return existingPayload;
}
