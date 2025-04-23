import { calculateQuotePrice } from "../../../../../utils/generic-utils";
import { SessionData } from "../../../session-types";

export const onInitGenerator = (
  existingPayload: any,
  sessionData: SessionData
) => {
  existingPayload.message.order.provider.id = sessionData.provider_id;
  // existingPayload.message.order.provider.locations[0].id =
  //   sessionData.location_id;

  const tempItems = sessionData.items;

  tempItems.forEach((item: any) => {
    delete item.category_id;
    delete item.tags;

    if (sessionData?.rate_basis) {
      delete item.fulfillment_id;
      item.fulfillment_ids = ["F1", "F2"];
    }
  });

  existingPayload.message.order.items = tempItems;
  existingPayload.message.order.fulfillments = sessionData.fulfillments;

  existingPayload.message.order.quote = {
    breakup: [
      {
        "@ondc/org/item_id": sessionData.items[0].id,
        "@ondc/org/title_type": "delivery",
        price: {
          currency: "INR",
          value: sessionData?.rate_basis ? "100.00" : "50.00",
        },
      },
      {
        "@ondc/org/item_id": sessionData.items[0].id,
        "@ondc/org/title_type": "tax",
        price: {
          currency: "INR",
          value: sessionData?.rate_basis ? "18.00" : "9.00",
        },
      },
      ...(sessionData?.is_cod === "yes"
        ? [
            {
              "@ondc/org/item_id": sessionData.items[1].id,
              "@ondc/org/title_type": "cod",
              price: {
                currency: "INR",
                value: "9.00",
              },
            },
            {
              "@ondc/org/item_id": sessionData.items[1].id,
              "@ondc/org/title_type": "tax",
              price: {
                currency: "INR",
                value: "2.00",
              },
            },
          ]
        : []),
    ],
    ttl: "PT15M",
  };

  if (sessionData?.feature_cancellation_terms === "yes") {
    existingPayload.message.order.cancellation_terms = [
      {
        fulfillment_state: {
          descriptor: {
            code: "Pending",
            short_desc: sessionData?.domain === "ONDC:LOG10" ? "132" : "203",
          },
        },
        cancellation_fee: {
          percentage: "0.00",
        },
      },
      {
        fulfillment_state: {
          descriptor: {
            code: "Agent-assigned",
            short_desc:
              sessionData?.domain === "ONDC:LOG10"
                ? "102,103,105"
                : "201,202,203",
          },
        },
        cancellation_fee: {
          percentage: "100.00",
        },
      },
      {
        fulfillment_state: {
          descriptor: {
            code: "Order-picked-up",
            short_desc:
              sessionData?.domain === "ONDC:LOG10"
                ? "125,126,127,128"
                : "225,226,227,228",
          },
        },
        cancellation_fee: {
          percentage: "100.00",
        },
      },
    ];
  }
  existingPayload.message.order.quote.price = {
    currency: "INR",
    value: calculateQuotePrice(existingPayload.message.order.quote.breakup),
  };

  if (sessionData?.rate_basis) {
    existingPayload.message.order.fulfillments[0].id = "F1";
    existingPayload.message.order.fulfillments.push({
      ...existingPayload.message.order.fulfillments[0],
      id: "F2",
    });
  }

  existingPayload.message.order.fulfillments =
    existingPayload.message.order.fulfillments.map((fulfullment: any) => {
      if (sessionData.category_id === "Immediate Delivery") {
        fulfullment.tags.push({
          code: "rider_check",
          list: [
            {
              code: "inline_check_for_rider",
              value: "yes",
            },
          ],
        });
      }
      return fulfullment;
    });

  if (sessionData.payment) {
    existingPayload.message.order.payment = sessionData.payment;
  }

  if (
    (sessionData.payment_type === "POST-FULFILLMENT" ||
      sessionData.payment_type === "ON-FULFILLMENT") &&
    existingPayload.message.order.payment.collected_by === "BAP"
  ) {
    existingPayload.message.order.payment["@ondc/org/settlement_details"] = [
      {
        settlement_counterparty: "lsp",
        settlement_type: "upi",
        beneficiary_name: "xxxxx",
        upi_address: "gft@oksbi",
        settlement_bank_account_no: "XXXXXXXXXX",
        settlement_ifsc_code: "XXXXXXXXX",
      },
    ];
  }

  if (
    sessionData.payment_type === "ON-ORDER" &&
    existingPayload.message.order.payment.collected_by === "BPP"
  ) {
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
            value: "5000.00",
          },
        ],
      },
    ];
  }

  return existingPayload;
};
