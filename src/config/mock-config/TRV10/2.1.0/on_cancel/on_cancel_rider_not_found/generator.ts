export async function onCancelRiderNotFoundGenerator(existingPayload: any, sessionData: any) {
    // Update payments if available
    if (sessionData.payments?.length > 0) {
        existingPayload.message.order.payments = sessionData.payments;
    }

    // Update items if available
    if (sessionData.items?.length > 0) {
        existingPayload.message.order.items = sessionData.items;
    }

    // Update fulfillments if available
    if (sessionData.fulfillments?.length > 0) {
        existingPayload.message.order.fulfillments = sessionData.selected_fulfillments;
        existingPayload.message.order.fulfillments[0].state.descriptor.code = 'RIDE_CANCELLED';
    }

    // Update order ID if available
    if (sessionData.order_id) {
        existingPayload.message.order.id = sessionData.order_id;
    }

    // Update quote if available
    if (sessionData.quote != null) {
        existingPayload.message.order.quote = sessionData.quote;
    }

    // Set cancellation details
    if (!existingPayload.message.order.cancellation) {
        existingPayload.message.order.cancellation = {
            cancelled_by: "PROVIDER",
            reason: {
                descriptor: {
                    code: "011"
                }
            }
        };
    }

    // Ensure order status is CANCELLED
    existingPayload.message.order.status = "CANCELLED";
    const now = new Date().toISOString();
    existingPayload.message.order.created_at = sessionData.created_at
    existingPayload.message.order.updated_at = now 

    return existingPayload;
}
