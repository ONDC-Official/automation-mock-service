import {
  calculateQuotePrice,
  removeTagsByCodes,
  resetQuotePrices,
} from "../../../../../../utils/generic-utils";
import { Input, SessionData } from "../../../session-types";
import { action } from "../default";

export const onCancelGenerator = (
  existingPayload: any,
  sessionData: SessionData,
  inputs: Input | undefined
  , action_id: string
) => {
  existingPayload.message.order.id = sessionData.order_id;

  if (sessionData?.fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
  }

  if (sessionData?.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  if (sessionData?.is_cancel_called === "cancel" || action_id === "seller_side_on_cancel_LOGISTICS") {
    existingPayload.message.order.state = "Cancelled";

    existingPayload.message.order.quote = sessionData.quote;

    existingPayload.message.order.cancellation = {
      cancelled_by: existingPayload.context.bap_id,
      reason: {
        id: sessionData?.is_cancel_called === "cancel" ? sessionData?.cancellation_reason_id : sessionData?.domain === "ONDC:LOG10" ? "102" : "200",
      },
    };
    const deliveryFulfillment = existingPayload.message.order.fulfillments.filter((fulfillment: any) => fulfillment.type === "Delivery")


    for (const fulfillment of deliveryFulfillment) {
      if (fulfillment.state.descriptor.code === "Pending" || fulfillment.state.descriptor.code === "Searching-for-Agent") {
        const updatedQuote = resetQuotePrices(existingPayload.message.order.quote);
        existingPayload.message.order.quote = updatedQuote
      }
    }

    existingPayload.message.order.fulfillments =
      existingPayload.message.order.fulfillments.map((fulfillment: any) => {
        fulfillment.tags.push({
          code: "precancel_state",
          list: [
            {
              code: "fulfillment_state",
              value: fulfillment.state.descriptor.code,
            },
            {
              code: "updated_at",
              value: sessionData?.order_updated_at_timestamp,
            },
          ],
        });
        fulfillment.state.descriptor.code = "Cancelled";

        return fulfillment;
      });
    console.log("existing payload", JSON.stringify(existingPayload.message.order.items));

  }
  // else if(action_id === "seller_side_on_cancel_LOGISTICS"){
  //   existingPayload.message.order.state = "Cancelled"

  //   existingPayload.message.order.cancellation = {
  //     cancelled_by: existingPayload.context.bpp_id,
  //     reason: {
  //       id: inputs?.cancellation_reason_id,
  //     },
  //   };
  // }
  else {
    existingPayload.message.order.state = "In-progress";

    existingPayload.message.order.cancellation = {
      cancelled_by: existingPayload.context.bpp_id,
      reason: {
        id: sessionData?.domain === "ONDC:LOG10" ? "127" : "226",
      },
    };

    let areDiffTagsPresent = false;

    existingPayload.message.order.fulfillments =
      existingPayload.message.order.fulfillments.map((fulfillment: any) => {
        if (fulfillment.type === "Delivery") {
          fulfillment.tags.push({
            code: "precancel_state",
            list: [
              {
                code: "fulfillment_state",
                value: fulfillment.state.descriptor.code,
              },
              {
                code: "updated_at",
                value: sessionData?.order_updated_at_timestamp,
              },
            ],
          });
          fulfillment.state.descriptor.code = "RTO";

          fulfillment.tags.push({
            code: "rto_event",
            list: [
              {
                code: "retry_count",
                value: sessionData?.domain === "ONDC:LOG10" ? "1" : "3",
              },
              {
                code: "rto_id",
                value: sessionData?.rto_id,
              },
              {
                code: "cancellation_reason_id",
                value: sessionData?.domain === "ONDC:LOG10" ? "127" : "226",
              },
              {
                code: "cancelled_by",
                value: existingPayload.context.bpp_id,
              },
            ],
          });

          fulfillment.tags = removeTagsByCodes(fulfillment.tags, ["tracking"]);
        }

        // check for diff tags
        fulfillment.tags.map((tag: any) => {
          if (tag.code === "linked_order_diff") {
            areDiffTagsPresent = true;
          }
        });

        return fulfillment;
      });

    existingPayload.message.order.fulfillments.push({
      id: sessionData?.rto_id,
      type: "RTO",
      state: {
        descriptor: {
          code: "RTO-Initiated",
        },
      },
      start: {
        time: {
          timestamp: existingPayload.context.timestamp,
        },
      },
    });

    existingPayload.message.order.items = sessionData.items;

    let rtoItem: any = null;

    sessionData?.on_search_items?.forEach((item: any) => {
      if (item.parent_item_id === sessionData.items[0].id) {
        delete item.price;
        delete item.parent_item_id;
        rtoItem = item;
      }
    });

    existingPayload.message.order.items.push(rtoItem);
    existingPayload.message.order.quote = sessionData.quote;
    existingPayload.message.order.quote.breakup = [
      ...existingPayload.message.order.quote.breakup,
      {
        "@ondc/org/item_id": rtoItem.id,
        "@ondc/org/title_type": "rto",
        price: {
          currency: "INR",
          value: sessionData?.rto_action === "no" ? "0.00" : "80.0",
        },
      },
      {
        "@ondc/org/item_id": rtoItem.id,
        "@ondc/org/title_type": "tax",
        price: {
          currency: "INR",
          value: sessionData?.rto_action === "no" ? "0.00" : "8.50",
        },
      },
      ...(areDiffTagsPresent
        ? [
          {
            "@ondc/org/item_id": rtoItem.id,
            "@ondc/org/title_type": "diff",
            price: {
              currency: "INR",
              value: "2.0",
            },
          },
          {
            "@ondc/org/item_id": rtoItem.id,
            "@ondc/org/title_type": "tax_diff",
            price: {
              currency: "INR",
              value: "1.00",
            },
          },
        ]
        : []),
    ];

    existingPayload.message.order.quote.price = {
      currency: "INR",
      value: calculateQuotePrice(existingPayload.message.order.quote.breakup),
    };

    // existingPayload.message.order.quote.price = {
    //   currency: "INR",
    //   value: areDiffTagsPresent ? "150.50" : "147.50",
    // };
  }

  if (sessionData.payment) {
    existingPayload.message.order.payment = sessionData.payment;
  }
  if (Array.isArray(sessionData.cancellation_terms) &&
    sessionData.cancellation_terms.length > 0) {
    existingPayload.message.order.cancellation_terms =
      sessionData.cancellation_terms;
  }
  if (sessionData.linked_order) {
    existingPayload.message.order["@ondc/org/linked_order"] =
      sessionData.linked_order;
  }

  if (sessionData?.confirm_create_at_timestamp) {
    existingPayload.message.order.created_at =
      sessionData?.confirm_create_at_timestamp;
  }

  existingPayload.message.order.updated_at = existingPayload.context.timestamp;
  if (sessionData.b2b_payments?.length > 0) {
    existingPayload.message.order.payments = sessionData.b2b_payments?.flat() ?? [];
    delete existingPayload.message.order.payment
  }
  console.log("existing payload in on_cancel", JSON.stringify(existingPayload));

  return existingPayload;
};
