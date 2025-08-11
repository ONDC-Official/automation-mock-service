import { SessionData } from "../../../../session-types";
import { createQuote } from "../../api-objects/breakup";

type Tag = {
  code: string;
  list: {
    code: string;
    value: string;
  }[];
};

export type Tags = Tag[];

export type SelectedItems = {
  id: string;
  quantity: {
    count: number;
  };
  fulfillment_id?: string;
  parent_item_id?: string;
  tags?: Tags;
  location_id: string;
}[];

export const breakupItem = {
  "@ondc/org/item_id": "I1",
  "@ondc/org/item_quantity": {
    count: 1,
  },
  title: "MINISO Two-Layer Drawer Organizer",
  "@ondc/org/title_type": "item",
  price: {
    currency: "INR",
    value: "2260.00",
  },
  item: {
    quantity: {
      available: {
        count: "99",
      },
      maximum: {
        count: "10",
      },
    },
    price: {
      currency: "INR",
      value: "2260.00",
    },
  },
};

export const breakup = [
  {
    "@ondc/org/item_id": "F1",
    title: "Delivery charges",
    "@ondc/org/title_type": "delivery",
    price: {
      currency: "INR",
      value: "493.75",
    },
  },
  {
    "@ondc/org/item_id": "F1",
    title: "Convenience Fee",
    "@ondc/org/title_type": "misc",
    price: {
      currency: "INR",
      value: "3.00",
    },
  },
];

export async function on_select_input_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  console.log("sessionData", JSON.stringify(sessionData));
  existingPayload.message.order.provider = sessionData.provider;
  const selectedItemsObj = sessionData.selected_items as SelectedItems;
  existingPayload.message.order.items = selectedItemsObj.map((item) => {
    const newItem: any = {
      id: item.id,
      fulfillment_id: item.fulfillment_id || "F1",
    };

    if (item.parent_item_id && item.tags) {
      newItem.parent_item_id = item.parent_item_id;
      newItem.tags = item.tags;
    }

    return newItem;
  });

  const quote = createQuote(
    selectedItemsObj.map((item) => {
      const newItem: any = {
        id: item.id,
        fulfillment_id: item.fulfillment_id || "F1",
        count: item.quantity.count,
      };

      if (item.parent_item_id && item.tags) {
        newItem.parent_item_id = item.parent_item_id;
        newItem.tags = item.tags;
      }

      return newItem;
    }),
    sessionData,
    existingPayload,
    existingPayload.message.order.fulfillments
  );

  existingPayload.message.order.quote = quote;
  console.log("existingpayload", JSON.stringify(existingPayload));
  return existingPayload;
}
