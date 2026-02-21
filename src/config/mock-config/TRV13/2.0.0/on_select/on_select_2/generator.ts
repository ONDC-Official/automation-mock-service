export async function onSelectDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {

  existingPayload.message.order.provider.id =
    sessionData?.select_provider_id ?? "P1";

  const selectItems = sessionData?.select_items[0] ?? [];
  const on_search_1_item = sessionData?.on_search_1_items[0] ?? [];

  existingPayload.message.order.items = selectItems.map((item: any) => ({
    id: item.id,
    add_ons: item.add_ons,
    payment_ids: [on_search_1_item[0]?.payment_ids[0]],
  }));

  existingPayload.message.order.quote = {
    price: {
      currency: "INR",
      value: "3025.00",
    },
    breakup: [
      {
        item: {
          id: selectItems[0]?.id ?? "Accommodation-1",
          quantity: selectItems[0]?.quantity ?? {
            selected: {
              count: 2,
            },
          },
          price: {
            currency: "INR",
            value: "2000.00",
          },
          ...(selectItems[0]?.add_ons?.some((a: any) => !!a.id)
            ? {
                add_ons: [
                  {
                    id: selectItems[0]?.add_ons[0]?.id,
                    price: {
                      currency: "INR",
                      value: "500.00",
                    },
                  },
                ],
              }
            : {}),
        },
        title: selectItems[0]?.add_ons?.some((a: any) => !!a.id)
          ? "Deluxe Room accommodation with all meals included (breakfast, lunch, and dinner)"
          : "Deluxe Room accommodation",
        price: {
          currency: "INR",
          value: "300.00",
        },
      },
      {
        title: "Service Tax @ 9%",
        price: {
          currency: "INR",
          value: "225",
        },
      },
      {
        title: "GST @ 12%",
        price: {
          currency: "INR",
          value: "300",
        },
      },
    ],
    ttl: "P1D",
  };

  let totalPrice = 0;

  existingPayload.message.order.quote.breakup.forEach((breakup: any) => {
    if (breakup.item) {
      let itemPrice =
        Number(breakup.item.price.value) *
        Number(breakup.item.quantity?.selected?.count ?? 1);

      if (breakup.item.add_ons?.length) {
        itemPrice += breakup.item.add_ons.reduce(
          (sum: number, addon: any) => sum + Number(addon.price.value),
          0
        );
      }

      breakup.price.value = itemPrice.toString();
      totalPrice += itemPrice;
    } else {
      // Parse percentage from title e.g. "Service Tax @ 9%" → 9
      const pctMatch = breakup.title?.match(/(\d+(?:\.\d+)?)%/);
      if (pctMatch) {
        const taxAmount = Math.round(
          (totalPrice * Number(pctMatch[1])) / 100
        );
        breakup.price.value = taxAmount.toString();
        totalPrice += taxAmount;
      } else {
        totalPrice += Number(breakup.price.value);
      }
    }
  });

  existingPayload.message.order.quote.price.value = totalPrice.toString();

  // Calculate payment amounts from quote total
  const advanceDepositAmount = (totalPrice * 0.5).toFixed(2); // 50% advance
  const finalPaymentAmount = (totalPrice * 0.5).toFixed(2); // 50% remaining

  existingPayload.message.order.payments = [
    {
      id: "pymnt-1",
      type: "PRE-ORDER",
      params: {
        currency: "INR",
        amount: totalPrice.toFixed(2),
      },
      tags: [
        {
          descriptor: {
            code: "FULL-PAYMENT",
          },
        },
      ],
    },
    {
      id: "pymnt-2",
      type: "ON-FULFILLMENT",
      params: {
        currency: "INR",
        amount: totalPrice.toFixed(2),
      },
      tags: [
        {
          descriptor: {
            code: "FULL-PAYMENT",
          },
        },
      ],
    },
    {
      id: "pymnt-3",
      type: "PART-PAYMENT",
      params: {
        currency: "INR",
        amount: totalPrice.toFixed(2),
      },
      tags: [
        {
          descriptor: {
            code: "LINKED-PAYMENTS",
          },
          list: [
            {
              descriptor: {
                code: "pymnt-4",
              },
              value: advanceDepositAmount,
            },
            {
              descriptor: {
                code: "pymnt-5",
              },
              value: finalPaymentAmount,
            },
          ],
        },
      ],
    },
    {
      id: "pymnt-4",
      type: "PRE-ORDER",
      tags: [
        {
          descriptor: {
            code: "ADV-DEPOSIT",
          },
        },
      ],
      params: {
        currency: "INR",
        amount: advanceDepositAmount,
      },
    },
    {
      id: "pymnt-5",
      type: "ON-FULFILLMENT",
      tags: [
        {
          descriptor: {
            code: "FINAL-PAYMENT",
          },
        },
      ],
      params: {
        currency: "INR",
        amount: finalPaymentAmount,
      },
    },
  ];

  const paymentIds = on_search_1_item[0]?.payment_ids ?? [];

  existingPayload.message.order.payments.forEach(
    (payment: any, index: number) => {
      if (index < paymentIds.length) {
        payment.id = paymentIds[index];
      }
    }
  );

  return existingPayload;
}
