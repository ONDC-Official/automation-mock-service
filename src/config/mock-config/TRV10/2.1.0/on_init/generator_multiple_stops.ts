import { SessionData } from "../../session-types";

const customer = {
    "contact": {
        "phone": "9876556789"
    },
    "person": {
        "name": "Joe Adams"
    }
}

export async function onInitMultipleStopsGenerator(
    existingPayload: any,
    sessionData: SessionData
) {
    const randomPaymentId = Math.random().toString(36).substring(2, 15);

    if (sessionData.items.length > 0) {
        existingPayload.message.order.items = sessionData.items;
        existingPayload.message.order.items[0]["payment_ids"] = [randomPaymentId]
    }
    if (sessionData.selected_fulfillments.length > 0) {
    existingPayload.message.order.fulfillments = sessionData.selected_fulfillments;
    existingPayload.message.order.fulfillments[0]["customer"] = customer
    existingPayload.message.order.fulfillments[0]["type"] = "DELIVERY"
    }
    if(sessionData.payments.length > 0){
        existingPayload.message.order.payments[0]["collected_by"] = sessionData.collected_by
        existingPayload.message.order.payments[0]["id"] = randomPaymentId
        }
    if(sessionData.quote != null){
    existingPayload.message.order.quote = sessionData.quote
    }
    existingPayload.message.order.provider.id = sessionData.provider_id
    return existingPayload;
}
