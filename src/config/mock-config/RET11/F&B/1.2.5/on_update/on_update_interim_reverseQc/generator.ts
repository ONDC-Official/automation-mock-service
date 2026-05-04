import { SessionData } from "../../../../session-types";

export async function on_update_interim_reverseQc_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.message.order.id = sessionData.order_id;
  if (sessionData.order_state) {
    existingPayload.message.order.state = sessionData.order_state;
  }
  existingPayload.message.order.provider = sessionData.provider;
  existingPayload.message.order.items = sessionData.items;
  existingPayload.message.order.billing = sessionData.billing;
  existingPayload.message.order.quote = sessionData.quote;
  existingPayload.message.order.payment = sessionData.payment;
  existingPayload.message.order.created_at = sessionData.confirm_created_at_timestamp;
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;

  console.log(
    "sessionData.update_fulfillments",
    JSON.stringify(sessionData.update_return_fulfillments)
  );

  const returnId = sessionData.update_return_fulfillments
    ?.find((entry: any) => entry.type === "Return")
    ?.tags?.find((tag: any) => tag.code === "return_request")
    ?.list?.find((item: any) => item.code === "id")?.value;

  console.log("returnId", returnId);
  existingPayload.message.order.fulfillments =
    sessionData?.update_return_fulfillments?.map((f: any) => {
      if (f.type == "Return") {
        f.tags.forEach((tag: any) => {
          tag.list.push({
            code: "initiated_by",
            value: `${existingPayload.context.bap_id}`,
          });
        });
        return {
          ...f,
          id: returnId,
          state: {
            descriptor: {
              code: "Return_Initiated",
            },
          },
          "@ondc/org/provider_name": "mock_lsp_provider",
        };
      }
    });

  console.log(
    "existingPayload.message.order.fulfillments",
    JSON.stringify(existingPayload.message.order.fulfillments)
  );
  const deliveryFulfillment = sessionData.fulfillments.find(
    (f: any) => f.type == "Delivery"
  );
  existingPayload.message.order.fulfillments.push(deliveryFulfillment);
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;

  return existingPayload;
}
