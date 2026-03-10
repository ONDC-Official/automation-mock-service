import { SessionData } from "../../session-types";

export async function cancelTechnicalCancellationHardGenerator(existingPayload: any, sessionData: SessionData) {
  if (sessionData.order_id) {
    existingPayload.message.order_id = sessionData.order_id;
  }
  existingPayload.message.cancellation_reason_id = sessionData.cancellation_reason_id
  existingPayload.message.descriptor.code = "CONFIRM_CANCEL"
  return existingPayload;
} 