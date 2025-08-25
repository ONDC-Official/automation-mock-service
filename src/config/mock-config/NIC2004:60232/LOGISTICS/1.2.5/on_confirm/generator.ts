import { populateFulfillmentConfim } from "../common_generator";
import { SessionData } from "../../../session-types";
import { calculateQuotePrice } from "../../../../../../utils/generic-utils";

export const onConfirmGenerator = (
  existingPayload: any,
  sessionData: SessionData,
  action_id:string
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

  if (action_id === "on_confirm_LOGISTICS_EXCHANGE") {
    const orderTags: any = existingPayload.message.order.tags;
    const newEntry = { code: "phone", value: "9886098860" };

    let bppTerms = orderTags.find((tag: any) => tag.code === "bpp_terms");
    if (!bppTerms) {
      bppTerms = { code: "bpp_terms", list: [] };
      orderTags.push(bppTerms);
    }
    bppTerms.list.push(newEntry);
  }
  if (action_id === "on_confirm_LOGISTICS_SLA") {
    existingPayload.message.order.tags.push(
      ...[
        {
          code: "lbnp_sla_terms",
          list: [
            {
              code: "metric",
              value: "Order_Accept",
            },
            {
              code: "base_unit",
              value: "mins",
            },
            {
              code: "base_min",
              value: "0",
            },
            {
              code: "base_max",
              value: "2",
            },
            {
              code: "penalty_min",
              value: "20",
            },
            {
              code: "penalty_max",
              value: "29.9",
            },
            {
              code: "penalty_unit",
              value: "percent",
            },
            {
              code: "penalty_value",
              value: "0.5",
            },
          ],
        },
        {
          code: "lbnp_sla_terms",
          list: [
            {
              code: "metric",
              value: "Order_Accept",
            },
            {
              code: "base_unit",
              value: "mins",
            },
            {
              code: "base_min",
              value: "0",
            },
            {
              code: "base_max",
              value: "2",
            },
            {
              code: "penalty_min",
              value: "30",
            },
            {
              code: "penalty_max",
              value: "",
            },
            {
              code: "penalty_unit",
              value: "percent",
            },
            {
              code: "penalty_value",
              value: "1",
            },
          ],
        },
      ]
    );
  }

  if (action_id === "on_confirm_LOGISTICS_RCM") {
    const orderTags: any = existingPayload.message.order.tags;
    const newEntry = {
      code: "np_tax_type",
      value: "RCM",
    };
    let bppTerms = orderTags.find((tag: any) => tag.code === "bpp_terms");
    if (!bppTerms) {
      bppTerms = { code: "bpp_terms", list: [] };
      orderTags.push(bppTerms);
    }
    bppTerms.list.push(newEntry);
  }
    
  return existingPayload;
};
