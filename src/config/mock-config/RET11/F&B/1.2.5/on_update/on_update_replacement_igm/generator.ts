import { Input, SessionData } from "../../../../session-types";
import {
  buildRetailQuote,
  generateQuoteTrail,
} from "../../../../../../../utils/generic-utils";
import { on_search_items } from "../../data";

export const onUpdateIgmReplacementGenerator = (
  existingPayload: any,
  sessionData: SessionData,
  action_id: string
) => {
  const item = sessionData.items;

  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }

  if (sessionData.order_state) {
    existingPayload.message.order.state = sessionData.order_state;
  }

  if (sessionData.provider) {
    existingPayload.message.order.provider = sessionData.provider;
  }

  if (sessionData.items) {
    existingPayload.message.order.items = [
      ...item,
      {
        id: item[0]?.id || "I1",
        fulfillment_id: "R1",
        quantity: item[0]?.quantity || {
          count: 1,
        },
      },
    ];
  }

  if (sessionData.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  if (sessionData.payment) {
    existingPayload.message.order.payment = sessionData.payment;
  }

  if (sessionData.fulfillments) {
    existingPayload.message.order.fulfillments = [
      ...sessionData.fulfillments,
      {
        id: "R1",
        type: "Return",
        "@ondc/org/provider_name": "LSP courier 1",
        state: {
          descriptor: {
            code: "Return_Picked",
          },
        },
        tags: [
          {
            code: "return_request",
            list: [
              {
                code: "id",
                value: "R1",
              },
              {
                code: "item_id",
                value: item[0]?.id || "I1",
              },
              {
                code: "item_quantity",
                value: String(item[0]?.quantity?.count) || "1",
              },
              {
                code: "reason_id",
                value: "003",
              },
              {
                code: "reason_desc",
                value: "detailed description for return",
              },
              {
                code: "images",
                value: "url_for_image1,url_for_image2",
              },
              {
                code: "ttl_approval",
                value: "PT24H",
              },
              {
                code: "ttl_reverseqc",
                value: "P3D",
              },
              {
                code: "initiated_by",
                value: "bnp.com",
              },
            ],
          },
          {
            code: "igm_request",
            list: [
              {
                code: "id",
                value: sessionData.issue_id || "Issue1",
              },
            ],
          },
          // {
          //   code: "quote_trail",
          //   list: [
          //     {
          //       code: "type",
          //       value: "item",
          //     },
          //     {
          //       code: "id",
          //       value: "I1",
          //     },
          //     {
          //       code: "currency",
          //       value: "INR",
          //     },
          //     {
          //       code: "value",
          //       value: "-170.00",
          //     },
          //   ],
          // },
          // {
          //   code: "quote_trail",
          //   list: [
          //     {
          //       code: "type",
          //       value: "tax",
          //     },
          //     {
          //       code: "id",
          //       value: "I1",
          //     },
          //     {
          //       code: "currency",
          //       value: "INR",
          //     },
          //     {
          //       code: "value",
          //       value: "0.00",
          //     },
          //   ],
          // },
          ...generateQuoteTrail(
            sessionData.quote.breakup,
            existingPayload.message.order.items,
            { partCancel: true }
          ),
        ],
      },
    ];
  }

  if (sessionData.quote) {
    existingPayload.message.order.quote = sessionData.quote;
  }

  existingPayload.message.order.updated_at =
    sessionData?.confirm_created_at_timestamp ?? new Date().toISOString();
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;
  return existingPayload;
};
