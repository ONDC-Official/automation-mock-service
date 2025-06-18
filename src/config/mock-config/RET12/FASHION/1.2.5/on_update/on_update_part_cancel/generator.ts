import { SessionData } from "../../../../session-types";
import { createQuote } from "../../api-objects/breakup";
import { getRandomItem } from "../../api-objects/utils";

const cancelFulfillment = {
  id: "C1123",
  type: "Cancel",
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
          value: "002",
        },
        {
          code: "initiated_by",
          value: "sellerNP.com",
        },
      ],
    },
    {
      code: "quote_trail",
      list: [
        {
          code: "type",
          value: "item",
        },
        {
          code: "id",
          value: "I1",
        },
        {
          code: "currency",
          value: "INR",
        },
        {
          code: "value",
          value: "-2260.00",
        },
      ],
    },
  ],
};

export async function on_update_part_cancel_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.message.order.id = sessionData.order_id;
  existingPayload.message.order.provider = sessionData.provider;
  existingPayload.message.order.billing = sessionData.billing;
  existingPayload.message.order.payment = sessionData.payment;
  existingPayload.message.order.created_at = sessionData.order_created_at;
  existingPayload.message.order.updated_at = new Date().toISOString();

  // Target item "I1" for partial cancellation (reduce quantity by 1)
  const itemsIds = sessionData.items.map((item: any) => item.id) as string[];
  const cancelId = getRandomItem(itemsIds) || "I1";
  const cancelItem = sessionData.items.find(
    (item: any) => item.id === cancelId
  );
  if (!cancelItem) {
    throw new Error(`Item with ID ${cancelId} not found`);
  }

  // Create a copy of the item for cancellation fulfillment
  const copyItem = JSON.parse(JSON.stringify(cancelItem));
  copyItem.fulfillment_id = cancelFulfillment.id;
  copyItem.quantity.count = 1; // Cancel only 1 unit
  sessionData.items.push(copyItem);

  // Update original item's quantity (reduce by 1)
  cancelItem.quantity.count -= 1;
  existingPayload.message.order.items = sessionData.items;

  // Update cancelFulfillment tags
  cancelFulfillment.tags[0].list[1].value = existingPayload.context.bpp_id; // initiated_by
  cancelFulfillment.tags[1].list[1].value = cancelId; // item ID

  // Update quote_trail value for one canceled item
  const itemQuote = sessionData.quote.breakup.find(
    (b: any) => b["@ondc/org/item_id"] === cancelId
  );
  if (!itemQuote) {
    throw new Error(`Quote for item ID ${cancelId} not found`);
  }
  const unitPrice = parseFloat(itemQuote.item.price.value);
  cancelFulfillment.tags[1].list[3].value = `-${unitPrice.toFixed(2)}`; // e.g., "-2260.00"

  // Add cancelFulfillment to fulfillments
  const fulfillments = sessionData.fulfillments;
  fulfillments.push(cancelFulfillment);
  existingPayload.message.order.fulfillments = fulfillments;

  // Prepare new items for quote recalculation
  const newItems = sessionData.items.map((item: any) => ({
    id: item.id,
    count: item.quantity.count,
    fulfillment_id: item.fulfillment_id,
  }));

  // Recalculate quote
  existingPayload.message.order.quote = createQuote(
    newItems,
    sessionData,
    existingPayload,
    fulfillments
  );

  return existingPayload;
}