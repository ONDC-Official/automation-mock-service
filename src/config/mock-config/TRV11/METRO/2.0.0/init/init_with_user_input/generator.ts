import { SessionData } from "../../../../session-types";

function validateUserInputs(sessionData: SessionData): boolean {
  const userItems = sessionData?.user_inputs?.items || [];
  const catalogItems = sessionData?.items || [];

  for (const inputItem of userItems) {
    const matchedItem = catalogItems.find(
      (item: any) => item.id === inputItem.itemId,
    );

    if (!matchedItem) {
      console.error("Invalid itemId:", inputItem.itemId);
      return false;
    }

    const min = matchedItem?.quantity?.minimum || 1;
    const max = matchedItem?.quantity?.maximum || Infinity;

    if (inputItem.count < min || inputItem.count > max) {
      console.error(
        `Invalid count for ${inputItem.itemId}: ${inputItem.count} (min:${min}, max:${max})`,
      );
      return false;
    }
  }

  return true;
}

function updateCollectedByAndBuyerFees(payload: any, sessionData: SessionData) {
  const payments = payload?.message?.order?.payments || [];

  payments.forEach((payment: any) => {
    // Update collected_by
    if (sessionData.collected_by)
      payment.collected_by = sessionData.collected_by;

    // Find the BUYER_FINDER_FEES tag
    const buyerFinderTag = payment.tags?.find(
      (tag: any) => tag.descriptor?.code === "BUYER_FINDER_FEES",
    );

    if (buyerFinderTag?.list) {
      // Find or create the BUYER_FINDER_FEES_PERCENTAGE entry
      const percentageEntry = buyerFinderTag.list.find(
        (item: any) => item.descriptor?.code === "BUYER_FINDER_FEES_PERCENTAGE",
      );

      if (sessionData.buyer_app_fee) {
        if (percentageEntry) {
          percentageEntry.value = sessionData.buyer_app_fee;
        } else {
          buyerFinderTag.list.push({
            descriptor: { code: "BUYER_FINDER_FEES_PERCENTAGE" },
            value: sessionData.buyer_app_fee,
          });
        }
      }
    }
  });

  return payload;
}
function updateSettlementAmount(payload: any, sessionData: SessionData) {
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

      const price: any = sessionData.price;
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

export async function initWithUserInputGenerator(
  existingPayload: any,
  sessionData: SessionData,
) {
  if (sessionData.billing && Object.keys(sessionData.billing).length > 0) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  console.log('sessionData', sessionData)

  if (sessionData?.user_inputs?.items?.length > 0) {
    const isValid = validateUserInputs(sessionData);

    if (!isValid) {
      existingPayload.error = {
        message: "Invalid itemId or quantity out of allowed range",
        code: "INVALID_USER_INPUT",
        valid: false,
      };

      return existingPayload;
    }

    existingPayload.message.order.items = sessionData.user_inputs.items.map(
      (inputItem: any) => ({
        id: inputItem.itemId,
        quantity: {
          selected: {
            count: inputItem.count,
          },
        },
      }),
    );
  }

  console.log("sessionData", JSON.stringify(sessionData));

  if (sessionData.selected_items && sessionData.selected_items.length > 0) {
    existingPayload.message.order.items = sessionData.selected_items;
  }
  if (sessionData.provider_id) {
    existingPayload.message.order.provider.id = sessionData.provider_id;
  }

  if (sessionData?.user_inputs?.items?.length > 0) {
    existingPayload.message.order.items = sessionData.user_inputs.items.map(
      (inputItem: any) => ({
        id: inputItem.itemId,
        quantity: {
          selected: {
            count: inputItem.count,
          },
        },
      }),
    );
  }

  existingPayload = updateSettlementAmount(existingPayload, sessionData);
  existingPayload = updateCollectedByAndBuyerFees(existingPayload, sessionData);
  return existingPayload;
}
