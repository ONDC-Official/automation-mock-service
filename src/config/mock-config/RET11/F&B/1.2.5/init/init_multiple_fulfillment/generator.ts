import { SessionData, Input } from "../../../../session-types";

export async function initMultipleFulfillmentGenerator(
  existingPayload: any,
  sessionData: SessionData,
  inputs?: Input
) {
  if (sessionData?.provider) {
    existingPayload.message.order.provider = sessionData.provider;
  }

  if (sessionData.select_fulfillment && sessionData.select_fulfillment.length) {
    sessionData.fulfillments?.forEach((fulfillment: any) => {
      if (fulfillment.id === inputs?.selectedFulfillment) {
        existingPayload.message.order.fulfillments[0] = {
          ...fulfillment,
          end: {
            location: {
              gps: sessionData?.select_fulfillment?.[0]?.end?.location?.gps,
              address: existingPayload.message.order.billing.address,
            },
            contact: {
              phone: "9886098860",
            },
          },
        };
      }

      if (inputs?.fulfillmentType === fulfillment.type) {
        existingPayload.message.order.fulfillments[0] = {
          ...fulfillment,
          end: {
            contact: {
              phone: "9886098860",
            },
          },
        };
      }
    });
  }

  if (sessionData?.items) {
    existingPayload.message.order.items = sessionData.items.map((item) => {
      return {
        ...item,
        fulfillment_id: existingPayload.message.order.fulfillments[0].id,
      };
    });
  }

  existingPayload.message.order.billing.created_at =
    existingPayload.context.timestamp;
  existingPayload.message.order.billing.updated_at =
    existingPayload.context.timestamp;

  return existingPayload;
}
