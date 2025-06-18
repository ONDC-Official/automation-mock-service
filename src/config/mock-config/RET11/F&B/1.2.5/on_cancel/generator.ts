import { SessionData, Input } from "../../../session-types";
import {
  buildRetailQuote,
  generateQuoteTrail,
} from "../../../../../../utils/generic-utils";
import { on_search_items, on_search_offers } from "../data";

export const onCancelGenerator = (
  existingPayload: any,
  sessionData: SessionData,
  inputs?: Input
) => {
  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }

  if (sessionData?.provider) {
    existingPayload.message.order.provider = sessionData.provider;
  }

  if (sessionData.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  if (sessionData.payment) {
    existingPayload.message.order.payment = sessionData.payment;
  }

  let newItems: any = [];

  sessionData.items.forEach((item: any) => {
    newItems.push({
      ...item,
      fulfillment_id: item.fulfillment_id,
      quantity: {
        count: 0,
      },
    });
    newItems.push({
      ...item,
      fulfillment_id: "C1",
      quantity: {
        count: item.quantity.count,
      },
    });
  });

  existingPayload.message.order.items = newItems;

  if (sessionData.fulfillments) {
    existingPayload.message.order.fulfillments[0] = {
      ...sessionData.fulfillments[0],
      state: {
        descriptor: {
          code: "Cancelled",
        },
      },
      tags: [
        {
          code: "cancel_request",
          list: [
            {
              code: "reason_id",
              value: inputs?.isForceCancel === "yes" ? "052" : "001",
            },
            {
              code: "initiated_by",
              value: existingPayload.context.bap_id,
            },
          ],
        },
        {
          code: "precancel_state",
          list: [
            {
              code: "fulfillment_state",
              value: sessionData.fulfillments[0].state.descriptor.code,
            },
            {
              code: "updated_at",
              value: sessionData?.confirm_created_at_timestamp,
            },
          ],
        },
      ],
    };

    existingPayload.message.order.fulfillments[1] = {
      id: "C1",
      type: "Cancel",
      state: {
        descriptor: {
          code: "Cancelled",
        },
      },
      tags: generateQuoteTrail(
        sessionData.quote.breakup,
        existingPayload.message.order.items,
        {}
      ),
    };
  }

  if (sessionData.quote) {
    existingPayload.message.order.quote = buildRetailQuote(
      existingPayload.message.order.items,
      on_search_items,
      existingPayload.message.order.fulfillments,
      {
        offers: sessionData?.offers,
        initalOffers: on_search_offers,
        fulfillmentState:
          sessionData?.order_state === "Created" ? "PRE" : "POST",
      }
    );
  }

  existingPayload.message.order.cancellation = {
    cancelled_by: existingPayload.context.bap_id,
    reason: {
      id: sessionData.cancellation_reason_id,
    },
  };

  existingPayload.message.order.created_at =
    sessionData.confirm_created_at_timestamp;
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;

  return existingPayload;
};
