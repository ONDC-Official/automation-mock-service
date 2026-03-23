import { SessionData } from "../../../../session-types";

type CancelInputType = {
  cancellation_reason_id?: string;
};

export async function cancel_return_request_generator(
  existingPayload: any,
  sessionData: SessionData,
  inputs?: any
) {
  console.log(existingPayload);

  const reasonId = inputs?.cancellation_reason_id ?? "052";

  existingPayload.message.cancellation_reason_id = reasonId;

  return existingPayload;
}
