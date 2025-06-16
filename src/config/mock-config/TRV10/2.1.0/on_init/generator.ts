import { SessionData } from "../../session-types";

type Price = {
    value: string;
    currency: string;
};

type Item = {
    id: string;
    price: Price;
};

type Breakup = {
    title: string;
    item?: Item;
    price: Price;
};

type Quote = {
    price: Price;
    breakup: Breakup[];
    ttl?: string;
};

interface Cancellation {
    cancelled_by: string;
    reason?: {
        code?: string;
        short_desc?: string;
    };
}

function applyCancellationCharges(quote: Quote, state: string): Quote {
    // Get cancellation fee based on ride state
    const getCancellationFee = (state: string): number => {
        switch (state) {
            case 'RIDE_ASSIGNED':
                return 0;
            case 'RIDE_ENROUTE_PICKUP':
                return 30;
            case 'RIDE_ARRIVED_PICKUP':
                return 50;
            case 'RIDE_STARTED':
                // 100% of ride value for cancellation after ride start
                return parseFloat(quote.price.value);
            default:
                return 0;
        }
    };

    const cancellationFee = getCancellationFee(state);
    const currentTotal = parseFloat(quote.price.value);

    // Create refund breakups for existing charges
    const refundBreakups: Breakup[] = quote.breakup.map(breakup => ({
        title: "REFUND",
        price: {
            currency: breakup.price.currency,
            value: `-${breakup.price.value}`
        }
    }));

    // Add cancellation charge breakup
    const cancellationBreakup: Breakup = {
        title: "CANCELLATION_CHARGES",
        price: {
            currency: "INR",
            value: cancellationFee.toFixed(2)
        }
    };

    // Calculate final amount (cancellation fee)
    return {
        price: {
            value: cancellationFee.toFixed(2),
            currency: "INR"
        },
        breakup: [...quote.breakup, ...refundBreakups, cancellationBreakup],
        ttl: "PT30S"
    };
}

export async function onInitGenerator(
    existingPayload: any,
    sessionData: SessionData
) {
    const randomPaymentId = Math.random().toString(36).substring(2, 15);
    // Update payments if present
    if (sessionData.updated_payments?.length > 0) {
        existingPayload.message.order.payments = sessionData.updated_payments;
    }

    // Update items if present
    if (sessionData.items?.length > 0) {
        
        existingPayload.message.order.items = sessionData.items;
        existingPayload.message.order.items[0]["payment_ids"] = [randomPaymentId]
    }

    // Update fulfillments if present
    if (sessionData.fulfillments?.length > 0) {
        existingPayload.message.order.fulfillments = sessionData.selected_fulfillments;
    }

    // Update order status if present
    if ('order_status' in sessionData) {
        existingPayload.message.order.status = sessionData.order_status;
    }

    // Handle cancellation and quote updates
    if ('cancellation' in sessionData) {
        const cancellation = sessionData.cancellation as Cancellation;
        
        const fulfillmentState = existingPayload.message.order.fulfillments[0]?.state?.descriptor?.code;
        if (fulfillmentState && existingPayload.message.order.quote) {
            existingPayload.message.order.quote = applyCancellationCharges(
                existingPayload.message.order.quote,
                fulfillmentState
            );
        }

        // Add cancellation details
        existingPayload.message.order.cancellation = {
            cancelled_by: cancellation.cancelled_by || "PROVIDER",
            reason: {
                descriptor: {
                    code: cancellation.reason?.code || "0",
                    short_desc: cancellation.reason?.short_desc || "Cancelled by the provider"
                }
            }
        };
    }


    if(sessionData.payments.length > 0){
        existingPayload.message.order.payments["id"] = randomPaymentId
        }

    if (existingPayload.message.order.fulfillments[0]["_EXTERNAL"]){
        delete existingPayload.message.order.fulfillments[0]["_EXTERNAL"]
      }
      existingPayload.message.order.payments = sessionData.payments
      if (existingPayload.message.order.payments[0]["_EXTERNAL"]){
        delete existingPayload.message.order.payments[0]["_EXTERNAL"]
      }

    // Update timestamps
    existingPayload.message.order.updated_at = new Date().toISOString();

    return existingPayload;
}