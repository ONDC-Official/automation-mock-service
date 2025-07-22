import { calculateQuotePrice } from "../../../../../../../utils/generic-utils";
import { SessionData } from "../../../../session-types";

export const onInitQCGenerator = (
  existingPayload: any,
  sessionData: SessionData
) => {
  existingPayload.message.order.provider.id = sessionData.provider_id;
  // existingPayload.message.order.provider.locations[0].id =
  //   sessionData.location_id;

  const tempItems = sessionData.items;
  let count = 0;
  const initFulfillments = sessionData?.fulfillments;
  let deliveryfulfillmentCount = 0;
  initFulfillments?.forEach((ful) => {
    if (ful.type === "Delivery") {
      deliveryfulfillmentCount++;
    }
  });
  if (sessionData.rate_basis === "rider")
    count = Math.max(
      parseInt(sessionData.rider_count),
      deliveryfulfillmentCount
    );
  else if (sessionData.rate_basis === "order")
    count = parseInt(sessionData.order_count);

  tempItems.forEach((item: any) => {
    delete item.tags;

    if (sessionData?.rate_basis && typeof count === "number") {
      item.fulfillment_ids = Array.from(
        { length: count },
        (_, i) => `F${i + 1}`
      );
    }
  });

  existingPayload.message.order.items = tempItems;

  if (sessionData?.rate_basis && count > 0 && sessionData.fulfillments?.[0]) {
    // Step 1: Start with the existing fulfillment as-is
    existingPayload.message.order.fulfillments = [sessionData.fulfillments[0]];

    // Step 2: Add (count) new fulfillments
    for (let i = 1; i <= count; i++) {
      const newFulfillment = JSON.parse(
        JSON.stringify(sessionData.fulfillments[0])
      ); // Deep copy
      newFulfillment.id = `F${i}`; // New unique ID
      newFulfillment.type = "Delivery"; // New type

      existingPayload.message.order.fulfillments.push(newFulfillment);
    }
  }
  existingPayload.message.order.quote = {
    breakup: [
      {
        "@ondc/org/item_id": sessionData.items[0].id,
        "@ondc/org/title_type": "delivery",
        price: {
          currency: "INR",
          value: sessionData?.rate_basis
            ? (count * parseFloat("50.00")).toString()
            : "50.00",
        },
      },
      {
        "@ondc/org/item_id": sessionData.items[0].id,
        "@ondc/org/title_type": "tax",
        price: {
          currency: "INR",
          value: sessionData?.rate_basis
            ? (count * parseFloat("9.00")).toString()
            : "9.00",
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

  existingPayload.message.order.fulfillments =
    existingPayload.message.order.fulfillments.map((fulfillment: any) => {
      if (
        sessionData.category_id === "Immediate Delivery" &&
        fulfillment.type === "Delivery"
      ) {
        fulfillment.tags.push({
          code: "rider_check",
          list: [
            {
              code: "inline_check_for_rider",
              value: "yes",
            },
          ],
        });
      }
      return fulfillment;
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
