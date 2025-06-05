import { SessionData } from "../../../../session-types";

export async function on_update_delivery_auth(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.message.order.provider = sessionData.provider;
  existingPayload.message.order.id = sessionData.order_id;
  existingPayload.message.order.items = sessionData.items;
  existingPayload.message.order.billing = sessionData.billing;
  existingPayload.message.order.quote = sessionData.quote;
  existingPayload.message.order.fulfillments = sessionData.fulfillments;
  existingPayload.message.order.payment = sessionData.payment;
  existingPayload.message.order.created_at = sessionData.order_created_at;
  existingPayload.message.order.updated_at = new Date().toISOString()

  const extraInstructions = {
    code: "5",
    short_desc: "1234",
  };
  
  existingPayload.message.order.fulfillments.forEach((fulfillment:any) => {
    if (fulfillment.type === "Delivery") {
      // Ensure end and instructions exist
      if (!fulfillment.end.instructions) {
        fulfillment.end.instructions = {};
      }
      // Merge extra instructions into existing instructions
      Object.assign(fulfillment.end.instructions, extraInstructions);
    }
  });

  return existingPayload;
}
