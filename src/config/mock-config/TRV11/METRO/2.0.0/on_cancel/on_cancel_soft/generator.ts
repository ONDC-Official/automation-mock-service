import { updateProviderTime } from "../../../../../../../utils/generic-utils";
import { SessionData } from "../../../../session-types";
import { removeAuthorizationAndTicketInfo } from "../on_cancel_tech/generator";

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
export function updateCancellationTimestamp(payload: any) {
  // deep clone to avoid mutating input
  const clone =
    typeof structuredClone === "function"
      ? structuredClone(payload)
      : JSON.parse(JSON.stringify(payload));

  const order = clone?.message?.order;
  if (!order || !order.cancellation) return clone;

  order.cancellation.time = new Date().toISOString();

  return clone;
}

function updateSettlementAmount(order: any, sessionData: SessionData) {
  if (!order?.payments || !order?.quote?.price?.value) return order;

  const quoteValue = parseFloat(order.quote.price.value);
  const buyerFinderFee = parseFloat(sessionData.buyer_app_fee || "3");
  const newSettlementAmount = (
    quoteValue -
    (quoteValue * buyerFinderFee) / 100
  ).toFixed(2);

  order.payments = order.payments.map((payment: any) => {
    if (!payment.tags) return payment;

    payment.tags = payment.tags.map((tag: any) => {
      if (
        tag.descriptor?.code === "SETTLEMENT_TERMS" &&
        Array.isArray(tag.list)
      ) {
        tag.list = tag.list.map((item: any) => {
          if (item.descriptor?.code === "SETTLEMENT_AMOUNT") {
            return {
              ...item,
              value: newSettlementAmount,
            };
          }
          return item;
        });
      }
      return tag;
    });

    return payment;
  });

  return order;
}

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

export async function onCancelSoftGenerator(
  existingPayload: any,
  sessionData: any,
) {
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
  if (sessionData.quote != null) {
    existingPayload.message.order.quote = applyCancellation(
      sessionData.quote,
      15,
    );
  }

  const now = new Date().toISOString();
  existingPayload.message.order.created_at = sessionData.created_at;
  existingPayload.message.order.updated_at = now;
  existingPayload = updateProviderTime(existingPayload);
  existingPayload = updateCancellationTimestamp(existingPayload);
  existingPayload.message.order.fulfillments = removeAuthorizationAndTicketInfo(
    existingPayload.message.order.fulfillments,
  );
  if (sessionData.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }
  existingPayload.message.order = updateSettlementAmount(
    existingPayload.message.order,
    sessionData,
  );
  return existingPayload;
}
