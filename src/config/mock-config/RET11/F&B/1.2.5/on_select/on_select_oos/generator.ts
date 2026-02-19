import { buildRetailQuote } from "../../../../../../../utils/generic-utils";
import { SessionData, Input } from "../../../../session-types";
import { on_search_items } from "../../data";

type TagEntry = {
  code: string;
  value: string;
};

type Tag = {
  code: string;
  list: TagEntry[];
};

type BreakupItem = {
  ["@ondc/org/title_type"]?: string;
  price?: { currency?: string; value?: string };
  item?: {
    quantity?: {
      available?: { count: string | number };
      maximum?: { count: string | number };
    };
    price?: { currency?: string; value?: string };
  };
  [key: string]: any;
};


function getTagType(tags: Tag[]): string | undefined {
  const typeTag = tags.find((tag) => tag.code === "type");

  if (!typeTag) return undefined;

  const typeEntry = typeTag.list.find((entry) => entry.code === "type");

  return typeEntry?.value;
}

export const onSelectOOSGenerator = (
  existingPayload: any,
  sessionData: SessionData,
  inputs?: Input
) => {
  if (sessionData?.provider) {
    existingPayload.message.order.provider = sessionData.provider;
  }
  const randomOutOfStockItem = getRandomItem(
    sessionData?.items?.map((item) => item.id)
  );

  let oosItmParentItemId = sessionData?.items?.find(
    (item) => item.id === randomOutOfStockItem
  ).parent_item_id;

  if (sessionData?.items && sessionData?.select_fulfillment?.length) {
    existingPayload.message.order.items = sessionData.items.map((item: any) => {
      return {
        ...item,
        quantity: {
          count:
            item.parent_item_id === oosItmParentItemId
              ? 0
              : item.quantity.count,
        },
        fulfillment_id: existingPayload.message.order.fulfillments?.find(
          (fulfillment: any) => fulfillment.type === "Delivery"
        )?.id,
      };
    });
  }

  existingPayload.message.order.quote = buildRetailQuote(
    existingPayload.message.order.items,
    on_search_items,
    existingPayload.message.order.fulfillments
  );


  const breakup: BreakupItem[] = existingPayload.message.order.quote.breakup || [];

  breakup.forEach((b) => {

    b.item ??= {};
    b.item.quantity ??= {
      available: { count: "0" },
      maximum: { count: "0" }
    };
    b.item.price ??= {
      currency: b.price?.currency || "INR",
      value: b.price?.value || "0.00"
    };
  });


  const errorMsg = [
    {
      dynamic_item_id: oosItmParentItemId,
      item_id: randomOutOfStockItem,
      error: "400002",
    },
  ];

  existingPayload.error = {
    type: "DOMAIN-ERROR",
    code: "40002",
    message: JSON.stringify(errorMsg),
  };

  return existingPayload;
};

export function getRandomItem(items: string[]): string | undefined {
  if (items.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}
