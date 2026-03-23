import { SessionData } from "../../../../session-types";

export async function onStatusActiveGenerator(
  existingPayload: any,
  sessionData: any,
) {
  if (sessionData.updated_payments.length > 0) {
    existingPayload.message.order.payments = sessionData.updated_payments;
  }

  if (sessionData.items.length > 0) {
    existingPayload.message.order.items = sessionData.items;
  }

  existingPayload.message.order.fulfillments =
    sessionData.on_confirm_fulfillment?.flat()

  if (sessionData.quote != null) {
    existingPayload.message.order.quote = sessionData.quote;
  }
  if (sessionData.order_id != null) {
    existingPayload.message.order.id = sessionData.order_id;
  }
  existingPayload.message.order.status = "ACTIVE";
  const now = new Date().toISOString();
  existingPayload.message.order.created_at = sessionData.created_at;
  existingPayload.message.order.updated_at = now;
  return existingPayload;
}

export async function onStatusCompletedGenerator(
  existingPayload: any,
  sessionData: SessionData,
) {
  if (sessionData.updated_payments.length > 0) {
    existingPayload.message.order.payments = sessionData.updated_payments;
  }

  if (sessionData.items.length > 0) {
    existingPayload.message.order.items = sessionData.items;
  }

  existingPayload.message.order.fulfillments =
    sessionData.on_confirm_fulfillment?.flat().map((fulfillment: any) => ({
      ...fulfillment,
      stops: fulfillment?.stops?.map((stop: any) => {
        if (stop?.type === "START" && stop?.authorization) {
          return {
            ...stop,
            authorization: {
              ...stop.authorization,
              status: "CLAIMED",
            },
          };
        }
        return stop;
      }),
    }));

  if (sessionData.quote != null) {
    existingPayload.message.order.quote = sessionData.quote;
  }
  if (sessionData.order_id != null) {
    existingPayload.message.order.id = sessionData.order_id;
  }
  existingPayload.message.order.status = "COMPLETED";
  const now = new Date().toISOString();
  existingPayload.message.order.created_at = sessionData.created_at;
  existingPayload.message.order.updated_at = now;
  return existingPayload;
}
