import { SessionData } from "../../../../session-types";
import { createFulfillments } from "../../api-objects/fulfillments";
import { createGenericOnStatus } from "../../api-objects/on_status";

export async function on_status_picked_fin_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  const generalPayload = createGenericOnStatus(existingPayload, sessionData);
  generalPayload.message.order.fulfillments = createFulfillments(
    "on_status",
    "on_status_picked",
    sessionData,
    generalPayload.message.order.fulfillments
  );
  generalPayload.message.order.fulfillments[0].start.time.timestamp =  existingPayload.context.timestamp;
  generalPayload.message.order.items[0].tags = [
    {
      code: "verify",
      list: [
        {
          code: "type",
          value: "IMEI",
        },
        {
          code: "value",
          value: "123456789012345",
        },
      ],
    },
    {
      code: "verify",
      list: [
        {
          code: "type",
          value: "IMEI",
        },
        {
          code: "value",
          value: "543210987654321",
        },
      ],
    },
  ];

  generalPayload.message.order.quote = sessionData.quote;
  generalPayload.message.order.payment = sessionData.payment;
  generalPayload.message.order.tags = sessionData.order_tags;
  return generalPayload;
}
