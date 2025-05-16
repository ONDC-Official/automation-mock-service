import { randomBytes } from "crypto";
import { SessionData } from "../../../../session-types";
function enhancePayments(payments: any) {
  const additionalParams = {
    bank_code: "XXXXXXXX",
    bank_account_number: "xxxxxxxxxxxxxx",
    virtual_payment_address: "9988199772@okicic",
  };

  return payments.map((payment: any) => ({
    ...payment,
    params: {
      ...payment.params,
      ...additionalParams,
    },
  }));
}
function generateQrToken(): string {
  return randomBytes(32).toString("base64");
}
function updateOrderTimestamps(payload: any) {
  const now = new Date().toISOString();
  if (payload.message.order) {
    payload.message.order.created_at = now;
    payload.message.order.updated_at = now;
  }
  return payload;
}

function updateFulfillmentsWithParentInfo(fulfillments: any[]): void {
  const validTo = "2024-07-23T23:59:59.999Z";

  fulfillments.forEach((fulfillment) => {
    // Generate a random QR token
    if (fulfillment.type === "TRIP") {
      fulfillment["state"] = {
        descriptor: {
          code: "INACTIVE",
        },
      };
      return;
    }
    const qrToken = generateQrToken();

    // Ensure stops array exists
    fulfillment.stops = fulfillment.stops || [];

    // If a stop exists, modify the first stop; otherwise, create a new one
    if (fulfillment.stops.length > 0) {
      fulfillment.stops[0].authorization = {
        type: "VEHICLE_NUMBER",
        status: "UNCLAIMED",
      };
    } else {
      fulfillment.stops.push({
        type: "START",
        authorization: {
          type: "VEHICLE_NUMBER",
          status: "UNCLAIMED",
        },
      });
    }

  });
}

export async function onConfirmVehConfGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  const randomId = Math.random().toString(36).substring(2, 15);
  const order_id = randomId;
  existingPayload.message.order.payments = enhancePayments(
    sessionData.updated_payments
  );
  updateFulfillmentsWithParentInfo(sessionData.fulfillments);

  // Check if items is a non-empty array
  if (sessionData.items.length > 0) {
    existingPayload.message.order.items = sessionData.items;
  }

  // Check if fulfillments is a non-empty array
  if (sessionData.fulfillments.length > 0) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
  }
  if (sessionData.quote != null) {
    existingPayload.message.order.quote = sessionData.quote;
  }
  existingPayload.message.order.id = order_id;
  existingPayload = updateOrderTimestamps(existingPayload);
  return existingPayload;
}
