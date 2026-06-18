import { updateProviderTime } from "../../../../../../utils/generic-utils";
import { SessionData } from "../../../session-types";

const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 15);
};

const createQuoteFromItems = (items: any): any => {
  let totalPrice = 0; // Initialize total price

  const breakup = items.map((item: any) => {
    const itemTotalPrice =
      Number(item.price.value) * item.quantity.selected.count; // Calculate item total price
    totalPrice += itemTotalPrice; // Add to total price

    return {
      title: "BASE_FARE",
      item: {
        id: item.id,
        price: {
          currency: item.price.currency,
          value: item.price.value,
        },
        quantity: {
          selected: {
            count: item.quantity.selected.count,
          },
        },
      },
      price: {
        currency: item.price.currency,
        value: itemTotalPrice.toFixed(2),
      },
    };
  });

  return {
    price: {
      value: totalPrice.toFixed(2), // Total price as a string with two decimal places
      currency: items[0]?.price.currency || "INR", // Use currency from the first item or default to "INR"
    },
    breakup,
  };
};

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

const transformPayments = (payments: any[]) => {
  return payments.map((payment: any) => {
    const tags = payment.tags ?? [];

    const updatedTags = tags.map((tag: any) => {
      if (tag?.descriptor?.code === "SETTLEMENT_TERMS") {
        const list = tag.list ?? [];

        // Remove existing SETTLEMENT_BASIS if present
        const filteredList = list.filter(
          (item: any) => item?.descriptor?.code !== "SETTLEMENT_BASIS",
        );

        return {
          ...tag,
          list: [
            ...filteredList,
            {
              descriptor: {
                code: "SETTLEMENT_BASIS",
              },
              value: "INVOICE_RECEIPT",
            },
          ],
        };
      }

      return tag;
    });

    return {
      id: generateRandomId(),
      collected_by: payment.collected_by,
      status: "NOT-PAID",
      type: "PRE-ORDER",
      params: {
        bank_code: "XXXXXXXX",
        bank_account_number: "xxxxxxxxxxxxxx",
      },
      tags: updatedTags,
    };
  });
};
export async function onInitGenerator(
  existingPayload: any,
  sessionData: SessionData,
) {
  if (sessionData.items.length > 0) {
    existingPayload.message.order.items = sessionData.items;
    const items = existingPayload.message.order.items;
    if (items[0].quantity.maximum) {
      delete items[0].quantity.maximum;
      delete items[0].quantity.mainimum;
      items.forEach((item: any) => {
        item.quantity = {
          selected: {
            count: 4,
          },
        };
        //   sessionData?.user_inputs?.Item_Quantity || 3; // Default to 1 if not provided
      });
    }

    console.log("items", items);
    if (sessionData.quote == null) {
      const quote = createQuoteFromItems(existingPayload.message.order.items);
      existingPayload.message.order.quote = quote;
    }
  }
  const payments = transformPayments(sessionData.payments);
  existingPayload.message.order.payments = payments;

  if (sessionData.fulfillments.length > 0) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
  }
  console.log('sessionData', sessionData)
  if (sessionData.quote != null) {
    existingPayload.message.order.quote = sessionData.quote;
  }
  if (sessionData.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }
  existingPayload = updateSettlementAmount(existingPayload, sessionData);
  existingPayload = updateProviderTime(existingPayload);
  return existingPayload;
}
