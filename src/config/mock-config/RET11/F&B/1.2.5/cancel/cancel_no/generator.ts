import { Input, SessionData } from "../../../../session-types";

type CancelInputType = {
  cancellation_reason_id?: string;
};

export async function cancelNoGenerator(
  existingPayload: any,
  sessionData: SessionData,
  inputs?: Input
) {
  // const inputs = sessionData.user_inputs as CancelInputType;

  const reasonId = inputs?.cancellation_reason_id ?? "001";
  if (sessionData?.order_id) {
    existingPayload.message.order_id = sessionData.order_id;
  }
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

  return existingPayload;
}