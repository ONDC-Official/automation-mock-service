import { populateFulfillmentUpdate } from "../../common_generator";
import {
  calculateQuotePrice,
  getTimestampFromDuration,
} from "../../../../../../../utils/generic-utils";
import { SessionData } from "../../../../session-types";

interface Tag {
  code: string;
  list: { code: string; value: string }[];
}

function removeTagsByCodes(tags: Tag[], codesToRemove: string[]): Tag[] {
  return tags.filter((tag) => !codesToRemove.includes(tag.code));
}

export const onUpdate1Generator = (
  existingPayload: any,
  sessionData: SessionData
) => {
  existingPayload.message.order.id = sessionData.order_id;

  if (sessionData?.fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
  }

  existingPayload.message.order.fulfillments =
    existingPayload.message.order.fulfillments.map((fulfillmet: any) => {

      fulfillmet.tags = [
        ...fulfillmet.tags,
        {
          code: "linked_order_diff",
          list: [
            {
              code: "id",
              value: "RO1",
            },
            {
              code: "weight_unit",
              value: "kilogram",
            },
            {
              code: "weight_value",
              value: "3.0",
            },
            {
              code: "dim_unit",
              value: "centimeter",
            },
            {
              code: "length",
              value: "1.0",
            },
            {
              code: "breadth",
              value: "1.0",
            },
            {
              code: "height",
              value: "1.0",
            },
          ],
        },
        {
          code: "linked_order_diff_proof",
          list: [
            {
              code: "type",
              value: "image",
            },
            {
              code: "url",
              value: "https://lsp.com/sorter/images1.png",
            },
          ],
        },
      ];

      return fulfillmet;
    });

  existingPayload.message.order.updated_at = existingPayload.context.timestamp;

  existingPayload.message.order.quote = sessionData.quote;

  if (sessionData.payment) {
    existingPayload.message.order.payment = sessionData.payment;
  }

  if (sessionData?.items) {
    existingPayload.message.order.items = sessionData.items;
  }

  if (sessionData?.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  if (sessionData?.quote) {
    existingPayload.message.order.quote = sessionData.quote;
  }

  existingPayload.message.order.quote.breakup = [
    ...existingPayload.message.order.quote.breakup,
    {
      "@ondc/org/item_id": sessionData.items[0].id,
      "@ondc/org/title_type": "diff",
      price: {
        currency: "INR",
        value: "9.00",
      },
    },
    {
      "@ondc/org/item_id": sessionData.items[0].id,
      "@ondc/org/title_type": "tax_diff",
      price: {
        currency: "INR",
        value: "2.00",
      },
    },
  ];
  if (Array.isArray(sessionData.cancellation_terms) &&
  sessionData.cancellation_terms.length > 0) {
    existingPayload.message.order.cancellation_terms = sessionData.cancellation_terms;
  }
  existingPayload.message.order.quote.price = {
    currency: "INR",
    value: calculateQuotePrice(existingPayload.message.order.quote.breakup),
  };

  if (sessionData.linked_order) {
    existingPayload.message.order["@ondc/org/linked_order"] =
      sessionData.linked_order;
  }

  existingPayload.message.order["@ondc/org/linked_order"].tags = [
    {
      code: "diff_dim",
      list: [
        {
          code: "unit",
          value: "centimeter",
        },
        {
          code: "length",
          value: "1.5",
        },
        {
          code: "breadth",
          value: "1.5",
        },
        {
          code: "height",
          value: "1.5",
        },
      ],
    },
    {
      code: "diff_weight",
      list: [
        {
          code: "unit",
          value: "kilogram",
        },
        {
          code: "weight",
          value: "1.5",
        },
      ],
    },
    {
      code: "diff_proof",
      list: [
        {
          code: "type",
          value: "image",
        },
        {
          code: "url",
          value: "https://lsp.com/sorter/images1.png",
        },
      ],
    },
  ];

  return existingPayload;
};
