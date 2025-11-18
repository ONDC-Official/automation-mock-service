import { SessionData, Input } from "../../../session-types";

export const cancelGenerator = (existingPayload: any,
  sessionData: SessionData,
  inputs: Input | undefined,
  action_id:string
) => {
  existingPayload.message.order_id = sessionData.order_id
  existingPayload.message.cancellation_reason_id = inputs?.cancellation_reason_id || "126"

  return existingPayload;
};
