import { SessionData } from "../../../session-types";

function updateOrderTimestamps(payload: any) {
    const now = new Date().toISOString();
    if (payload.message.order) {
        payload.message.order.created_at = now;
        payload.message.order.updated_at = now;
    }
    return payload;
}

function updateFulfillmentState(fulfillment: any): void {
    // Set fulfillment state to RIDE_CONFIRMED
    fulfillment.state = {
        descriptor: {
            code: "RIDE_CONFIRMED"
        }
    };
}

export async function onConfirmDriverNotAssignedGenerator(
    existingPayload: any,
    sessionData: SessionData
) {
    const order_id = Math.random().toString(36).substring(2, 15);
    existingPayload.message.order.id = order_id;

    // Update order status to ACTIVE
    existingPayload.message.order.status = "ACTIVE";

    // Update fulfillments with state
    if (sessionData.fulfillments?.length > 0) {
        sessionData.fulfillments.forEach(fulfillment => {
            updateFulfillmentState(fulfillment);
        });
        existingPayload.message.order.fulfillments = sessionData.fulfillments;
    }

    // Update items if present
    if (sessionData.items?.length > 0) {
        existingPayload.message.order.items = sessionData.items;
    }

    // Update quote if present
    if (sessionData.quote) {
        existingPayload.message.order.quote = sessionData.quote;
    }

    // Update payments if present
    if (sessionData.updated_payments?.length > 0) {
        existingPayload.message.order.payments = sessionData.updated_payments;
    }

    // Add cancellation terms
    existingPayload.message.order.cancellation_terms = [
        {
            cancellation_fee: { percentage: "0" },
            fulfillment_state: { descriptor: { code: "RIDE_ASSIGNED" } },
            reason_required: true
        },
        {
            cancellation_fee: { amount: { currency: "INR", value: "30" } },
            fulfillment_state: { descriptor: { code: "RIDE_ENROUTE_PICKUP" } },
            reason_required: true
        },
        {
            cancellation_fee: { amount: { currency: "INR", value: "50" } },
            fulfillment_state: { descriptor: { code: "RIDE_ARRIVED_PICKUP" } },
            reason_required: true
        },
        {
            cancellation_fee: { percentage: "100" },
            fulfillment_state: { descriptor: { code: "RIDE_STARTED" } },
            reason_required: true
        }
    ];

    // Update timestamps
    existingPayload = updateOrderTimestamps(existingPayload);

    return existingPayload;
} 