import { SessionData } from "../../session-types"

const customer = {
    "contact": {
        "phone": "9876556789"
    },
    "person": {
        "name": "Joe Adams"
    }
}

export async function confirmMultipleStopsGenerator(existingPayload: any,sessionData: SessionData){
    existingPayload.message.order.fulfillments = sessionData.selected_fulfillments
    existingPayload.message.order.fulfillments[0]["customer"] = customer
    existingPayload.message.order.items[0] = {
        id : sessionData.selected_item_id 
    }
    existingPayload.message.order.payments = sessionData.payments
    existingPayload.message.order.provider.id = sessionData.provider_id
    return existingPayload;
}