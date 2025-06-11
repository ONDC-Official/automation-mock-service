import { SessionData } from "../../../../session-types";

type CancelInputType = {
  cancellation_reason_id?: string;
};

export async function cancel_return_request_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  console.log(existingPayload);

  const inputs = sessionData.user_inputs as CancelInputType;

  const reasonId = inputs?.cancellation_reason_id ?? "001";

  existingPayload.message.cancellation_reason_id = reasonId;

  return existingPayload;
}
