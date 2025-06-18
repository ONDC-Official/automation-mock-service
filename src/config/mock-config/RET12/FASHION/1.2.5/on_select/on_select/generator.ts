import { SessionData } from "../../../../session-types";
import { createQuote } from "../../api-objects/breakup";
export type SelectedItems = {
  id: string;
  quantity: {
    count: number;
  };
  fulfillment_id?: string;
  location_id: string;
}[];

export const breakupItem = {
  "@ondc/org/item_id": "I1",
  "@ondc/org/item_quantity": {
    count: 1,
  },
  title: "Butterfly Beautiful 13 Gold Necklace",
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

export async function on_select_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  console.log("sessionData", JSON.stringify(sessionData));
  existingPayload.message.order.provider = sessionData.provider;
  const selectedItemsObj = sessionData.selected_items as SelectedItems;
  existingPayload.message.order.items = selectedItemsObj.map((item) => {
    return {
      id: item.id,
      fulfillment_id: item.fulfillment_id || "F1",
    };
  });

  const quote = createQuote(
    selectedItemsObj.map((item) => {
      return {
        id: item.id,
        count: item.quantity.count,
        fulfillment_id: "F1",
      };
    }),
    sessionData,
    existingPayload,
    existingPayload.message.order.fulfillments
  );
  existingPayload.message.order.quote = quote;
  console.log("existingpayload", JSON.stringify(existingPayload));
  return existingPayload;
}
