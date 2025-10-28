import { SessionData } from "../../session-types";

export async function cancelTechnicalCancellationGenerator(existingPayload: any, sessionData: SessionData) {
  if (sessionData.order_id) {
    existingPayload.message.order_id = sessionData.order_id;
  }
  existingPayload.message.cancellation_reason_id = '000'
  return existingPayload;
} 