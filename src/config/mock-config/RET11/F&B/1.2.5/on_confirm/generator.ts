import { SessionData } from "../../../session-types";

export const onConfirmGenerator = (
  existingPayload: any,
  sessionData: SessionData
) => {
  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }

  if (sessionData.provider) {
    existingPayload.message.order.provider = sessionData.provider;
  }

  if (sessionData.items) {
    existingPayload.message.order.items = sessionData.items;
  }

  if (sessionData.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  if (sessionData.quote) {
    existingPayload.message.order.quote = sessionData.quote;
  }

  if (sessionData.payment) {
    existingPayload.message.order.payment = sessionData.payment;
  }

  if (sessionData.fulfillments) {
    existingPayload.message.order.fulfillments[0] = {
      ...sessionData.fulfillments[0],
      state: {
        descriptor: {
          code: "Pending",
        },
      },
      "@ondc/org/provider_name": "LSP Provider",
      "@ondc/org/TAT": "PT60M",
      tracking: sessionData.fulfillments[0].type === "Delivery" ? true : false,
      start: {
        location: {
          id: "L1",
          descriptor: {
            name: "ABC Store",
          },
          gps: "77.2039,28.5705",
          address: {
            locality: "my store locality",
            city: "my store city",
            area_code:
              sessionData?.select_fulfillment?.[0].end.location.address
                .area_code,
            state: "my store state",
          },
        },
        contact: {
          phone: "9886098860",
          email: "nobody@nomail.com",
        },
      },
      end: {
        ...sessionData.fulfillments[0].end,
        person: {
          name: "name_of_person",
        },
      },
    };
  }

  existingPayload.message.order.created_at =
    sessionData.confirm_created_at_timestamp;
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;

  return existingPayload;
};
