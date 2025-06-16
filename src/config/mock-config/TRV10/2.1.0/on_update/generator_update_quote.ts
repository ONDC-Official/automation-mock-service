import { SessionData } from "../../session-types";
import { onUpdateMultipleStopsGenerator } from "./generator_multiple_stops";

export async function onUpdateUpdateQuoteGenerator(existingPayload: any,sessionData: SessionData){
    existingPayload = await onUpdateMultipleStopsGenerator(existingPayload,sessionData)
    if (sessionData.quote != null) {
        if (Array.isArray(sessionData.update_quote)) {
            existingPayload.message.order.quote = sessionData.update_quote[0] || {}; // Assign first element or an empty object
        } else {
            existingPayload.message.order.quote = sessionData.update_quote;
        }
    }
    existingPayload.message.order.id = sessionData.order_id;
    existingPayload.message.order.items[0].price.value = sessionData.updated_price
    existingPayload.message.order.status = "COMPLETE"
    return existingPayload;
}