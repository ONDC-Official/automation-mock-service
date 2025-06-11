import { SessionData } from "../../../session-types";
import { RET12FASHION125Catalog } from "../on_search/on_search/catalog";
import { Fulfillments } from "./fulfillments";

const breakupItem = {
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

const breakup = [
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
export function createQuote(
  selectedItems: { id: string; count: number; fulfillment_id: string }[],
  sessionData: SessionData,
  existingPayload: any,
  fulfillments: Fulfillments,
  cancelled: boolean = false
) {
  console.log("\n ## Creating Quote with selected items: \n", selectedItems);

  let totalPrice = 0;
  let totalQuantity = 0;
  let itemSet = new Set<string>();
  const breakupObject = [];
  const catalogItems = RET12FASHION125Catalog.catalog[
    "bpp/providers"
  ][0].items.filter((i: any) => {
    console.log("Catalog Item: ", i.id);
    const idMap = selectedItems.map((item) => item.id);
    console.log("ID Map: ", idMap);
    return idMap.includes(i.id);
  });
  for (const selectedItem of selectedItems ?? []) {
    const fulfillment = fulfillments.find(
      (f: any) => f.id === selectedItem.fulfillment_id
    );
    if (
      !fulfillment ||
      !["Delivery", "Self-Pickup", "Buyer-Delivery"].includes(
        fulfillment.type ?? ""
      )
    ) {
      continue;
    }
    const catalogItem = catalogItems.find((i: any) => i.id === selectedItem.id);
    if (!catalogItem) continue; // Skip if item not found in catalog

    const quantity = cancelled ? 0 : selectedItem.count ?? 1;
    const price = parseFloat(catalogItem.price.value) * quantity;
    console.log("Price: ", price, catalogItem.price.value);
    totalPrice += price;

    const breakupClone = JSON.parse(
      JSON.stringify(breakupItem)
    ) as typeof breakupItem;
    breakupClone["@ondc/org/item_id"] = catalogItem.id;
    breakupClone.title = catalogItem.descriptor.name;
    breakupClone["@ondc/org/item_quantity"].count = quantity;
    breakupClone.price.value = `${price.toFixed(2)}`;
    breakupClone.item.price.value = catalogItem.price.value;
    breakupObject.push(breakupClone);

    if (sessionData.out_of_stock_item_ids?.includes(catalogItem.id)) {
      breakupClone.item.quantity.available.count = "0";
      breakupClone.item.quantity.maximum.count = "0";
      breakupClone["@ondc/org/title_type"] = "0";
      existingPayload.error = {
        type: "DOMAIN-ERROR",
        code: "40002",
        message: `Item with id: ${catalogItem.id} is out of stock`,
      };
    } else {
      totalQuantity += selectedItem.count ?? 0;
      if (quantity > 0) itemSet.add(catalogItem.id);
    }
  }

  breakupObject.push(breakup[0]);
  breakupObject.push(breakup[1]);
  totalPrice += parseFloat(breakup[0].price.value)
  totalPrice += parseFloat(breakup[1].price.value)
  console.log(`Total Price: ${totalPrice.toFixed(2)}`);
  console.log(`Total Quantity: ${JSON.stringify(breakupObject)}`);
  return {
    breakup: breakupObject,
    price: {
      currency: "INR",
      value: `${totalPrice.toFixed(2)}`,
    },
    ttl: "P1D",
  };
}
