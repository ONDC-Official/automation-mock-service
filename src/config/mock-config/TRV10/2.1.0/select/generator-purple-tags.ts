import { SessionData } from "../../session-types";

function getRandomId(items: any[]): number {
  if (items.length === 0) throw new Error("Array is empty");

  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

export async function selectPurpleTagsGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  if (sessionData.item_ids) {
    const item_id = sessionData.user_inputs.Item_id
    const item = sessionData.items.find((i) => i.id === item_id);
    const fulfillmentId = item?.fulfillment_ids?.[0];

    const orderItem = existingPayload.message.order.items[0];
    const orderFulfillment = existingPayload.message.order.fulfillments[0];

    orderItem.id = item_id;
    orderFulfillment.id = fulfillmentId;
    existingPayload.message.order.provider.id = sessionData.provider_id;

    if (!orderItem.tags) {
      orderItem.tags = [];
    }

    orderItem.tags.push({
      descriptor: {
        code: "DISABILITY_VIS",
        name: "Vision Impairment",
      },
      display: false,
      list: [
        {
          descriptor: {
            code: "VIS_LEVEL",
            name: "Level of Disability",
            short_desc: "Disability of Blind and low vision",
          },
          value: "LOW",
        },
        {
          descriptor: {
            code: "VIS_SCREEN_READER_USAGE",
            name: "Screen Reader Usage",
            short_desc: "Screen Reader Usage",
          },
          value: "JAWS",
        },
        {
          descriptor: {
            code: "VIS_CANE_USAGE",
            name: "Cane Usage",
            short_desc: "Cane Usage",
          },
          value: "Yes",
        },
        {
          descriptor: {
            code: "VIS_SPECIAL_REQUIREMENT",
            name: "special requirement",
            short_desc: "Custom description",
          },
          value: "CUSTOM TEXT ENTERED BY USER",
        },
      ],
    });
  }

  return existingPayload;
}
