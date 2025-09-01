import { SessionData } from "../../../../session-types";

const { v4: uuidv4 } = require("uuid");

const transformPaymentsToPaid = (
  payments: any,
  amount: any,
  currency = "INR"
) => {
  return payments.map((payment: any) => ({
    ...payment,
    status: "PAID",
    params: {
      transaction_id: uuidv4(), // Generates a UUID for transaction_id
      currency,
      amount,
    },
  }));
};
export async function confirmVehConGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  if (sessionData.billing && Object.keys(sessionData.billing).length > 0) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  if (sessionData.selected_items && sessionData.selected_items.length > 0) {
    existingPayload.message.order.items = sessionData.selected_items;
  }
  if (sessionData.provider_id) {
    existingPayload.message.order.provider.id = sessionData.provider_id;
  }
  if (sessionData.buyer_side_fulfillment_ids) {
    existingPayload.message.order.fulfillments = sessionData.buyer_side_fulfillment_ids;
  }
  existingPayload.message.order.fulfillments = existingPayload.message.order.fulfillments.map((f:any) => ({
    ...f,
    vehicle: {
      registration: "MOCK_REG"
    }
  }));
  if (sessionData.payments) {
    existingPayload.message.order.payments = transformPaymentsToPaid(
      sessionData.payments,
      sessionData.price
    );
  }
  return existingPayload;
}
