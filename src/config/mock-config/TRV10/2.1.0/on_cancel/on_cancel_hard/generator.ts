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

  function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  function applyCancellation(quote: Quote, cancellationCharges: number): Quote {
    // Parse the current price
    const currentTotal = parseFloat(quote.price.value);
  
    // Calculate the total refund for items
    const refundAmount = quote.breakup
       .reduce((sum, breakup) => {
        const itemTotal = parseFloat(breakup.price.value);
        return sum + itemTotal;
      }, 0);
  
   
   
    // Create a CANCELLATION_CHARGES breakup with higher charges for hard cancellation
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
        value: `-${refundAmount}`,
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
  
  export async function onCancelHardGenerator(existingPayload: any, sessionData: any) {
    if (sessionData.payments?.length > 0) {
      existingPayload.message.order.payments = sessionData.payments;
    }
    
    if (sessionData.items?.length > 0) {
      existingPayload.message.order.items = sessionData.items;
    }
  
    if (sessionData.fulfillments?.length > 0) {
      existingPayload.message.order.fulfillments = sessionData.selected_fulfillments;
    }
    
    existingPayload.message.order.cancellation.reason.descriptor.code =
    sessionData.cancellation_reason_id;
    
    for (const fulfillment of existingPayload.message.order.fulfillments) {
      if (fulfillment.stops && Array.isArray(fulfillment.stops)) {
        fulfillment.stops = fulfillment.stops.map((stop: any) => {
          const { authorization, ...rest } = stop; 
          return rest;
        });
      }
      
    }
  
    if (sessionData.order_id) {
      existingPayload.message.order.id = sessionData.order_id;
    }
  
    if (sessionData.quote != null) {
      existingPayload.message.order.quote = applyCancellation(sessionData.quote, 10);
    }
    const now = new Date().toISOString();
    existingPayload.message.order.created_at = sessionData.created_at
    existingPayload.message.order.updated_at =existingPayload.context.timestamp
  
    return existingPayload;
  }