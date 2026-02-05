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
      .filter((b) => b.title === "BASE_FARE" && b.item)
      .reduce((sum, breakup) => {
        const itemTotal = parseFloat(breakup.price.value);
        return sum + itemTotal;
      }, 0);
  
    // Create a REFUND breakup for items
    const refundBreakups: Breakup[] = quote.breakup
      .filter((b) => b.title === "BASE_FARE" && b.item)
      .map((baseFare) => ({
        title: "REFUND",
        item: {
          ...baseFare.item!,
          price: {
            ...baseFare.item!.price,
            value: `-${baseFare.item!.price.value}`, // Negative for refund
          },
        },
        price: {
          ...baseFare.price,
          value: `-${baseFare.price.value}`, // Negative for refund
        },
      }));
  
    // Create a CANCELLATION_CHARGES breakup
    const cancellationBreakup: Breakup = {
      title: "CANCELLATION_CHARGES",
      price: {
        currency: "INR",
        value: cancellationCharges.toFixed(2),
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
      breakup: [...quote.breakup, ...refundBreakups, cancellationBreakup],
    };
  }


function applyMerchantCancellation(quote: Quote): Quote {
    const currentTotal = parseFloat(quote.price.value);
    
    const refundBreakups: Breakup[] = quote.breakup
      .filter((b) => b.title === "BASE_FARE" && b.item)
      .map((baseFare) => ({
        title: "REFUND",
        item: {
          ...baseFare.item!,
          price: { ...baseFare.item!.price, value: `-${baseFare.item!.price.value}` }
        },
        price: { ...baseFare.price, value: `-${baseFare.price.value}` }
      }));
  
    const cancellationBreakup: Breakup = {
      title: "CANCELLATION_CHARGES",
      price: { currency: "INR", value: "0" }
    };
  
    return {
      price: { ...quote.price, value: "0" },
      breakup: [...quote.breakup, ...refundBreakups, cancellationBreakup]
    };
}


  export async function onCancelSoftGenerator(existingPayload: any,sessionData: any){
    // Detect Merchant Side Cancellation flow
    const isMerchantCancel = sessionData.flowId === "MERCHANT_SIDE_CANCELLATION_FLOW";
    if (sessionData.updated_payments.length > 0) {
      existingPayload.message.order.payments = sessionData.updated_payments;
      }
    
    if (sessionData.items.length > 0) {
    existingPayload.message.order.items = sessionData.items;
    }
  
    if (sessionData.fulfillments.length > 0) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
    }
    if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
    }
    if(sessionData.quote != null){
      if (isMerchantCancel) {
        // Merchant cancel: Full refund, 0 charges
        existingPayload.message.order.quote = applyMerchantCancellation(sessionData.quote);
      } else {
        // User cancel: Apply charges
        existingPayload.message.order.quote = applyCancellation(sessionData.quote, 15);
      }
    }
    
    // Set PROVIDER for merchant cancellation
    if (isMerchantCancel && existingPayload.message.order.cancellation) {
      existingPayload.message.order.cancellation.cancelled_by = "PROVIDER";
      existingPayload.message.order.cancellation.reason = {
        id: "1",
        descriptor: { code: "SERVICE_UNAVAILABLE", name: "Service unavailable" }
      };
    }
    const now = new Date().toISOString();
    existingPayload.message.order.created_at = sessionData.created_at
    existingPayload.message.order.updated_at = now
    return existingPayload;
}