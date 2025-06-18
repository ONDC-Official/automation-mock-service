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

  let oosItmParentItemId = sessionData?.items?.find(
    (item) => item.id === inputs?.oosItem
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


  const errorMsg = [
    {
      dynamic_item_id: oosItmParentItemId,
      item_id: inputs?.oosItem,
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
