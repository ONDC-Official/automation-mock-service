import { endianness } from "os";
import { SessionData } from "../../../../session-types";
import { Fulfillment } from "../../api-objects/fulfillments";

export async function on_update_interim_reverseQc_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.message.order.id = sessionData.order_id;
  existingPayload.message.order.provider = sessionData.provider;
  existingPayload.message.order.items = sessionData.items;
  existingPayload.message.order.billing = sessionData.billing;
  existingPayload.message.order.quote = sessionData.quote;
  existingPayload.message.order.payment = sessionData.payment;
  existingPayload.message.order.created_at = sessionData.order_created_at;
  existingPayload.message.order.updated_at = new Date().toISOString();

  const deliveryFulfillment = existingPayload.message.order.fulfillments.find(
    (f: Fulfillment) => f.type == "Delivery"
  ) as Fulfillment;

  existingPayload.message.order.fulfillments = sessionData.fulfillments.map(
    (f: Fulfillment) => {
      if (f.type == "Return") {
        return {
          ...f,
          state: {
            descriptor: {
              code: "Return_Initiated",
            },
          },
          "@ondc/org/provider_name": "mock_lsp_provider",
        };
      }
      return f;
    }
  );

  return existingPayload;
}
