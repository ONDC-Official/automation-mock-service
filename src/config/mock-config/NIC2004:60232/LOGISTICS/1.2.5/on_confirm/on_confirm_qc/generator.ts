import { populateFulfillmentConfim } from "../../common_generator";
import { SessionData } from "../../../../session-types";
import { calculateQuotePrice } from "../../../../../../../utils/generic-utils";

export const onConfirmQCGenerator = (
  existingPayload: any,
  sessionData: SessionData
) => {
  existingPayload.message.order.id = sessionData.order_id;

  if (sessionData?.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  existingPayload.message.order.items = sessionData?.items;

  if (sessionData?.confirm_create_at_timestamp) {
    existingPayload.message.order.created_at =
      sessionData.confirm_create_at_timestamp;
  }
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;

  if (sessionData?.fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
  }

  if ( Array.isArray(sessionData.cancellation_terms) &&
  sessionData.cancellation_terms.length > 0) {
    existingPayload.message.order.cancellation_terms =
      sessionData.cancellation_terms;
  }
  existingPayload.message.order.fulfillments =
    existingPayload.message.order.fulfillments.map((fulfillmet: any) => {
      fulfillmet.state = {
        descriptor: {
          code: "Pending",
        },
      };
      fulfillmet.tags.push({
        code: "weather_check",
        list: [
          {
            code: "raining",
            value: "no",
          },
        ],
      });

      return fulfillmet;
    });
  existingPayload = populateFulfillmentConfim(existingPayload, sessionData);
  existingPayload.message.order.quote = sessionData.quote;
  if (sessionData?.feature_surge_fee === "yes") {
    existingPayload.message.order.quote.breakup.push(
      {
        "@ondc/org/item_id": "I3",
        "@ondc/org/title_type": "surge",
        price: {
          currency: "INR",
          value: "9.00",
        },
      },
      {
        "@ondc/org/item_id": "I3",
        "@ondc/org/title_type": "tax",
        price: {
          currency: "INR",
          value: "2.00",
        },
      }
    );
    existingPayload.message.order.quote.price = {
      currency: "INR",
      value: calculateQuotePrice(existingPayload.message.order.quote.breakup),
    };
    existingPayload.message.order.items[0].tags = [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "base",
          },
        ],
      },
    ];
    existingPayload.message.order.items.push({
      id: "I3",
      parent_item_id: "I1",
      category_id: sessionData?.category_id,
      fulfillment_id: "1",
      tags: [
        {
          code: "type",
          list: [
            {
              code: "type",
              value: "surge",
            },
          ],
        },
      ],
    });
  }

  if (sessionData.payment) {
    existingPayload.message.order.payment = sessionData.payment;
  }

  if (
    sessionData.payment_type === "ON-ORDER" &&
    existingPayload.message.order.payment.collected_by === "BPP"
  ) {
    existingPayload.message.order.payment.params = {
      currency: "INR",
      transaction_id: "txn1234",
      amount: existingPayload.message.order.quote.price.value,
    };
    existingPayload.message.order.payment.status === "PAID";
    existingPayload.message.order.payment.tags = [
      {
        code: "wallet_balance",
        list: [
          {
            code: "currency",
            value: "INR",
          },
          {
            code: "value",
            value: (
              5000 -
              parseInt(
                existingPayload.message.order.quote.price.value || "4850"
              )
            ).toString(),
          },
        ],
      },
    ];
  }

  if (sessionData.linked_order) {
    existingPayload.message.order["@ondc/org/linked_order"] =
      sessionData.linked_order;
  }

  return existingPayload;
};
