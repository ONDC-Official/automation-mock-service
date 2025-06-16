import { SessionData } from "../../session-types";
import { selectMultipleStopsGenerator } from "./generator";

function findItem(items: any[], itemId: string) {
  
  return items.find(item => item.id === itemId);
}

  
  function updateItemPrice(item: any, amount: number) {
    if (!item || !item.price || typeof item.price.value !== "string") return null;
  
    const updatedItem = { ...item }; // Create a new object to avoid mutation
    const currentPrice = parseFloat(updatedItem.price.value);
    updatedItem.price.value = (currentPrice + amount).toString();
  
    return updatedItem;
  }
  

export async function selectPreOrderBidGenerator(existingPayload: any, sessionData: SessionData) {
    existingPayload = await selectMultipleStopsGenerator(existingPayload,sessionData)
    const item = findItem(sessionData.items,String(existingPayload.message.order.items[0].id))
    const randomNum = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
    const updatedItem = updateItemPrice(item,randomNum)
    existingPayload.message.order.items[0].price = {
      currency: "INR",
      value: updatedItem.price.value
    }
    
    return existingPayload;
}