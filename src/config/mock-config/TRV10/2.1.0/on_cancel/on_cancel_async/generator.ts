import { SessionData } from "../../../session-types";

type Price = {
  value: string;
  currency: string;
};

type Item = {
  id: string;
  price: Price;
  quantity: {
    selected: {
      count: number;
    };
  };
};

type Breakup = {
  title: string;
  item?: Item;
  price: Price;
};

type Quote = {
  price: Price;
  breakup: Breakup[];
};

function applyCancellation(quote: Quote, cancellationCharges: number): Quote {
  // Parse the current price
  const currentTotal = parseFloat(quote.price.value);

  // Calculate the total refund for items
  const refundAmount = quote.breakup
    .reduce((sum, breakup) => {
      const itemTotal = parseFloat(breakup.price.value);
      return sum + itemTotal;
    }, 0);

 // Create a CANCELLATION_CHARGES breakup
  const cancellationBreakup: Breakup = {
    title: "CANCELLATION_CHARGES",
    price: {
      currency: "INR",
      value: cancellationCharges.toFixed(2),
    },
  };
  const refundBreakups: Breakup = {
    title: "REFUND",
    price: {
      currency: "INR",
      value: `-${refundAmount.toFixed(2)}`,
    },
  };

  // Update the total price
  const newTotal = currentTotal - refundAmount + cancellationCharges;

  // Return the updated quote
  return {
    price: {
      ...quote.price,
      value: newTotal.toFixed(2),
    },
    breakup: [...quote.breakup, refundBreakups, cancellationBreakup],
  };
}

export async function onCancelAsyncGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  if (sessionData.payments?.length > 0) {
    existingPayload.message.order.payments = sessionData.payments;
  }

  if (sessionData.items?.length > 0) {
    existingPayload.message.order.items = sessionData.items;
  }

  if (sessionData.fulfillments?.length > 0) {
    existingPayload.message.order.fulfillments =
      sessionData.selected_fulfillments;
      const stops = existingPayload.message.order.fulfillments[0].stops.map((stopItem: any) => {
        const token = stopItem.authorization?.token;
        const type = stopItem.authorization?.type;
       return {
          ...stopItem,
          ...(token && {
            authorization: {
              token,
              type
            }
          })
        };
      });
      
          existingPayload.message.order.fulfillments[0] = {
      ...existingPayload.message.order.fulfillments[0],
      state: {
        descriptor: {
          code: "RIDE_CANCELLED",
        },
       },
       stops:stops
    };
  }

  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }

  if (sessionData.quote != null) {
    // Using standard cancellation charges for async cancellation
    existingPayload.message.order.quote = applyCancellation(
      sessionData.quote,
      20
    );
  }

  const now = new Date().toISOString();
  existingPayload.message.order.created_at =sessionData.created_at;
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;
  return existingPayload;
}
