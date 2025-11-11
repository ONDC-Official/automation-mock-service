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
  const refundAmount = quote.breakup.reduce((sum, breakup) => {
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

function modifyBAPNBPPTags(tags: any) {
  tags.forEach((tag: any) => {
    tag.tags.forEach((tag: any) => {
      tag.list.forEach((item: any) => {
        if (item.descriptor?.code === "SETTLEMENT_AMOUNT") {
          item.value = "0";
        }
      });
    });
  });
  return tags;
}

export async function onCancelRiderNotFoundGenerator(
  existingPayload: any,
  sessionData: any
) {
  // Update payments if available
  if (sessionData.payments?.length > 0) {
    existingPayload.message.order.payments = sessionData.payments;
    // existingPayload.message.order.payments = modifyBAPNBPPTags(sessionData.payments);
  }

  if (sessionData.tags?.length > 0) {
    // existingPayload.message.order.tags = sessionData.tags;
    existingPayload.message.order.tags = modifyBAPNBPPTags(sessionData.tags);
  }

  // Update items if available
  if (sessionData.items?.length > 0) {
    existingPayload.message.order.items = sessionData.items;
  }

  // Update fulfillments if available
  if (sessionData.fulfillments?.length > 0) {
    existingPayload.message.order.fulfillments =
      sessionData.selected_fulfillments;
    existingPayload.message.order.fulfillments[0].state.descriptor.code =
      "RIDE_CANCELLED";
  }

  // Update order ID if available
  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }

  // Update quote if available
  if (sessionData.quote != null) {
    existingPayload.message.order.quote = applyCancellation(
      sessionData.quote,
      10
    );
  }

  // Set cancellation details
  if (!existingPayload.message.order.cancellation) {
    existingPayload.message.order.cancellation = {
      cancelled_by: "PROVIDER",
      reason: {
        descriptor: {
          code: "011",
        },
      },
    };
  }

  // Ensure order status is CANCELLED
  existingPayload.message.order.status = "CANCELLED";
  const now = new Date().toISOString();
  existingPayload.message.order.created_at = sessionData.created_at;
  existingPayload.message.order.updated_at = now;

  return existingPayload;
}
