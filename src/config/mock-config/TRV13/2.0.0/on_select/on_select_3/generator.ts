export async function onSelectDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;

  existingPayload.message.order.provider.id =
    sessionData?.select_provider_id ?? "P1";

  const selectItems = sessionData?.select_items[0] ?? [];
  // const on_search_1_item = sessionData?.on_search_1_items[0] ?? [];

  existingPayload.message.order.items = selectItems.map((item: any) => ({
    id: item.id,
    add_ons: item.add_ons,
    // payment_ids: [on_search_1_item[0]?.payment_ids[0]],
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
          add_ons: [
            {
              id: selectItems[0]?.add_ons[0]?.id ?? "full-board",
              price: {
                currency: "INR",
                value: "500.00",
              },
            },
          ],
        },
        title:
          "Deluxe Room accommodation with all meals included (breakfast, lunch, and dinner)",
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
          value: "400",
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
      totalPrice += Number(breakup.price.value);
    }
  });

  existingPayload.message.order.quote.price.value = totalPrice.toString();

  existingPayload.message.order.payments = [
    {
      id: "pymnt-1",
      type: "PRE-ORDER",
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
              value: "1",
            },
            {
              descriptor: {
                code: "pymnt-5",
              },
              value: "2",
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
        amount: "2000.00",
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
        amount: "1025.00",
        currency: "INR",
      },
    },
  ];

  // const paymentIds = on_search_1_item[0]?.payment_ids ?? [];

  // existingPayload.message.order.payments.forEach(
  //   (payment: any, index: number) => {
  //     if (index < paymentIds.length) {
  //       payment.id = paymentIds[index];
  //     }
  //   }
  // );

  return existingPayload;
}
