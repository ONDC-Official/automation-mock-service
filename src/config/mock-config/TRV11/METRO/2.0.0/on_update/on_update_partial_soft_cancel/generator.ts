function updateSettlementAmount(payload: any, sessionData: any) {
  const payments = payload?.message?.order?.payments || [];

  payments.forEach((payment: any) => {
    const collectedBy = sessionData.collected_by;
    const settlementTerms = payment.tags?.find(
      (tag: any) => tag.descriptor?.code === "SETTLEMENT_TERMS",
    );

    if (settlementTerms && settlementTerms.list) {
      const settlementAmountEntry = settlementTerms.list.find(
        (entry: any) => entry.descriptor?.code === "SETTLEMENT_AMOUNT",
      );

      const price: any = Number(payload.message?.order?.quote?.price?.value);
      const feePercentage: any = sessionData.buyer_app_fee;
      const feeAmount = (price * feePercentage) / 100;

      const finalAmount = collectedBy === "BAP" ? price - feeAmount : feeAmount;

      if (settlementAmountEntry) {
        settlementAmountEntry.value = finalAmount.toString();
      } else {
        // Add it if not already present
        settlementTerms.list.push({
          descriptor: { code: "SETTLEMENT_AMOUNT" },
          value: finalAmount.toString(),
        });
      }
    }
  });

  return payload;
}

export async function onUpdatePartialSoftCancelGenerator(
  existingPayload: any,
  sessionData: any,
) {
  existingPayload.message.order = sessionData?.on_confirm_order ?? {};
  existingPayload.message.order.status = "SOFT_CANCEL";

  const items = JSON.parse(JSON.stringify(existingPayload.message.order.items));
  const fulfillmentToRemoveId = sessionData.update_fulfillment?.[0]?.id;

  items.forEach((item: any) => {
    if (item.quantity?.selected?.count) {
      item.quantity.selected.count = Math.max(
        0,
        item.quantity.selected.count - 1,
      );
    }

    if (fulfillmentToRemoveId && Array.isArray(item.fulfillment_ids)) {
      item.fulfillment_ids = item.fulfillment_ids.filter(
        (id: string) => id !== fulfillmentToRemoveId,
      );
    }
  });

  existingPayload.message.order.items = items;

  const quote = JSON.parse(JSON.stringify(existingPayload.message.order.quote));

  const baseFareBreakup = quote.breakup?.find(
    (b: any) => b.title === "BASE_FARE",
  );
  if (baseFareBreakup && baseFareBreakup.item?.price?.value) {
    const itemPriceValue = parseFloat(baseFareBreakup.item.price.value);
    const currentQuotePrice = parseFloat(quote.price.value);

    quote.price.value = (currentQuotePrice - itemPriceValue).toString();

    quote.breakup.push({
      title: "CANCELLATION_CHARGES",
      price: {
        currency: quote.price.currency || "INR",
        value: "0",
      },
    });

    quote.breakup.push({
      title: "REFUND",
      price: {
        currency: quote.price.currency || "INR",
        value: (-itemPriceValue).toString(),
      },
      item: {
        id: baseFareBreakup.item.id,
        price: {
          currency: baseFareBreakup.item.price.currency || "INR",
          value: baseFareBreakup.item.price.value,
        },
        quantity: {
          selected: {
            count: 1,
          },
        },
        fulfillment_ids: fulfillmentToRemoveId ? [fulfillmentToRemoveId] : [],
      },
    });
  }

  if (sessionData.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }
  existingPayload.message.order.quote = quote;
  existingPayload = updateSettlementAmount(existingPayload, sessionData);
  const now = new Date().toISOString();
    existingPayload.message.order.updated_at = now
  return existingPayload
}
