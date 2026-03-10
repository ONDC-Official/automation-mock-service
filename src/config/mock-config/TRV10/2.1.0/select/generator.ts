import { SessionData } from "../../session-types";
function getRandomId(items: any[]): number {
    if (items.length === 0) throw new Error("Array is empty");
  
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }
  
export async function selectMultipleStopsGenerator(existingPayload: any, sessionData: SessionData) {
    if (sessionData.item_ids){
      const item_ids = sessionData.item_ids
    const item_id = getRandomId(item_ids)
    const item = sessionData.items.find(i => i.id === item_id);
    const fulfillmentId = item?.fulfillment_ids?.[0];
    existingPayload.message.order.fulfillments[0].id = fulfillmentId
    existingPayload.message.order.items[0].id = item_id
    existingPayload.message.order.provider.id = sessionData.provider_id
    }
    return existingPayload;
}