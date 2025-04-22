import { SessionData } from "../../../session-types";

export async function onInitGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  // const randomPaymentId = Math.random().toString(36).substring(2, 15);

  // // Replace quote if available in session
  // if (sessionData.quote) {
  //   existingPayload.message.order.quote = sessionData.quote;
  // }

  // // Replace items if provided
  // if (sessionData.items && sessionData.items.length > 0) {
  //   existingPayload.message.order.items = sessionData.items;

  //   // Optional: ensure all items link to the generated payment_id if required
  //   existingPayload.message.order.items.forEach((item: any) => {
  //     item.payment_ids = [randomPaymentId];
  //   });
  // }

  // // Replace fulfillments if provided
  // if (sessionData.fulfillments && sessionData.fulfillments.length > 0) {
  //   existingPayload.message.order.fulfillments = sessionData.fulfillments;

  //   // Optionally sanitize type
  //   existingPayload.message.order.fulfillments.forEach((fulfillment: any) => {
  //     if (fulfillment.type) {
  //       fulfillment.type = "DELIVERY";
  //     }
  //   });
  // }

  // // Replace billing info if provided
  // if (sessionData.billing) {
  //   existingPayload.message.order.billing = sessionData.billing;
  // }

  // // Replace payment section
  // if (sessionData.payment) {
  //   existingPayload.message.order.payment = sessionData.payment;
  // }

  return existingPayload;
}
