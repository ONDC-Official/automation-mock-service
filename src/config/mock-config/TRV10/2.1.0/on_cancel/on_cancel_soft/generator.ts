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
  
  function applyCancellation(quote: Quote): Quote {
    // Parse the current price
    const currentTotal = parseFloat(quote.price.value);
  
    // Calculate the total refund for items
    const refundAmount = quote.breakup
      .filter((b) => b.title !== "CANCELLATION_CHARGES")
      .reduce((sum, breakup) => {
        const itemTotal = parseFloat(breakup.price.value);
        return sum + itemTotal;
      }, 0);
  
    // Create REFUND breakups for all non-cancellation charges
    const refundBreakups: Breakup[] = quote.breakup
      .filter((b) => b.title !== "CANCELLATION_CHARGES")
      .map((breakupItem) => ({
        title: "REFUND",
        item: breakupItem.item,
        price: {
          ...breakupItem.price,
          value: `-${breakupItem.price.value}`, // Negative for refund
        },
      }));
  
    // For rider not found, no cancellation charges are applied
    const newTotal = 0; // Total should be 0 as full refund is given
  
    return {
      price: {
        ...quote.price,
        value: newTotal.toFixed(2),
      },
      breakup: [...quote.breakup, ...refundBreakups],
    };
  }
  
  export async function onCancelRiderNotFoundGenerator(
    existingPayload: any,
    sessionData: any
  ) {
    if (sessionData.payments.length > 0) {
      existingPayload.message.order.payments = sessionData.payments;
    }
  
    if (sessionData.items.length > 0) {
      existingPayload.message.order.items = sessionData.items;
    }
  
    if (sessionData.fulfillments.length > 0) {
      existingPayload.message.order.fulfillments = sessionData.selected_fulfillments;
    }
  
    if (sessionData.order_id) {
      existingPayload.message.order.id = sessionData.order_id;
    }
  
    if (sessionData.quote != null) {
      existingPayload.message.order.quote = applyCancellation(sessionData.quote);
    }
  
    return existingPayload;
  }