import { SessionData } from "../../../../session-types";
export async function update_reverse_qc_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.message.order.id = sessionData.order_id;
  const items = sessionData.items;
  const itemIds = items.map((item: any) => item.id);
  // const id = getRandomItem(itemIds);

  const allTags = sessionData.items.map((item: any) => {
    const tags = JSON.parse(
      JSON.stringify(existingPayload.message.order.fulfillments[0].tags)
    );
    tags[0].list[0].value = "R1";
    tags[0].list[1].value = item.id;
    tags[0].list[2].value = `${item.quantity?.count}` || "0";
    return tags[0];
  });
  existingPayload.message.order.fulfillments[0].tags = allTags;
  console.log("existingPayload", JSON.stringify(existingPayload));

  return existingPayload;
}
