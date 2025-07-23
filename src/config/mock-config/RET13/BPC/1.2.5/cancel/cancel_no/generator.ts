import { SessionData } from "../../../../session-types";
import { addDurationToTimestamp } from "../../on_status/on_status_out_for_delivery_force/generator";

type CancelInputType = {
  cancellation_reason_id?: string;
};

export async function cancel_no_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  const inputs = sessionData.user_inputs as CancelInputType;

  const reasonId = inputs?.cancellation_reason_id ?? "001";
  existingPayload.message.order_id = sessionData.order_id;
  existingPayload.message.cancellation_reason_id = reasonId;
  existingPayload.message.descriptor = {
    name: "fulfillment",
    short_desc: "F1",
    tags: [
      {
        code: "params",
        list: [
          {
            code: "force",
            value: "no",
          },
          {
            code: "ttl_response",
            value: "PT10S",
          },
        ],
      },
    ],
  };

  const tat = sessionData.tat;
  const updatedTime = addDurationToTimestamp(
    existingPayload.context.timestamp,
    tat
  );

  existingPayload.context.timestamp = updatedTime;

  return existingPayload;
}
