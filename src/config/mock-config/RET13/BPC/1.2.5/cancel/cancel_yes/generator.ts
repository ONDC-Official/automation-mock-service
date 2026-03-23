import { SessionData } from "../../../../session-types";
import { addDurationToTimestamp } from "../../on_status/on_status_out_for_delivery_force/generator";

type CancelInputType = {
  cancellation_reason_id?: string;
};

export async function cancel_yes_generator(
  existingPayload: any,
  sessionData: SessionData,
  inputs?: any
) {

  const reasonId = inputs?.cancellation_reason_id ?? "052";
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
            value: "yes",
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
  if (tat) {
    const updatedTime = addDurationToTimestamp(
      existingPayload.context.timestamp,
      tat
    );
    existingPayload.context.timestamp = updatedTime;
  }
  return existingPayload;
}
