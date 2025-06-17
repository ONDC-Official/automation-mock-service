import { SessionData, Input } from "../../../../session-types";

export const updateReturnGenerator = (
  existingPayload: any,
  sessionData: SessionData,
  inputs?: Input
) => {
  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }

  let parentItemId = "";

  sessionData.items.forEach((item) => {
    if (item.id === inputs?.returnItemId) {
      parentItemId = item.parent_item_id;
    }
  });

  let tags: any[] = [];

  sessionData.items.forEach((item) => {
    if (item.parent_item_id === parentItemId) {
      tags.push({
        code: "return_request",
        list: [
          {
            code: "id",
            value: "R1",
          },
          {
            code: "item_id",
            value: item.id,
          },
          {
            code: "parent_item_id",
            value: parentItemId,
          },
          {
            code: "item_quantity",
            value: item?.quantity?.count?.toString() || "0",
          },
          {
            code: "reason_id",
            value: inputs?.returnReason,
          },
          {
            code: "reason_desc",
            value: "detailed description for return",
          },
          {
            code: "images",
            value:
              "https://automation.ondc.org/image1,https://automation.ondc.org/image2",
          },
          {
            code: "ttl_approval",
            value: "PT24H",
          },
          {
            code: "ttl_reverseqc",
            value: "P3D",
          },
        ],
      });
    }
  });

  existingPayload.message.order.fulfillments = [
    {
      type: "Return",
      tags: tags,
    },
  ];

  return existingPayload;
};
