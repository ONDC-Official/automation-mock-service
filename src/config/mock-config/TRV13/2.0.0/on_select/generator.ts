export async function onSelectDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {

  existingPayload.message.order.provider.id =
    sessionData?.select_provider_id ?? "P1";

  const selectItems = sessionData?.select_items[0] ?? [];
  const catalogItems = sessionData?.on_search_1_items[0] ?? [];

  // Find selected item in catalog to get actual prices
  const selectedItemId = selectItems[0]?.id;
  const catalogItem = catalogItems.find((item: any) => item.id === selectedItemId) ?? catalogItems[0];

  // Get item price from catalog
  const itemPrice = Number(catalogItem?.price?.value ?? "2000.00");
  const quantity = selectItems[0]?.quantity?.selected?.count ?? 1;

  // Get selected addon and its price from catalog
  const selectedAddonId = selectItems[0]?.add_ons?.[0]?.id;
  const catalogAddon = catalogItem?.add_ons?.find((a: any) => a.id === selectedAddonId);
  const addonPrice = selectItems[0]?.add_ons?.length
    ? Number(catalogAddon?.price?.value ?? "0.00")
    : 0;
  const addonName = catalogAddon?.descriptor?.short_desc ?? "Accommodation with all meals included";

  // Calculate totals
  const baseItemTotal = itemPrice * quantity;
  const totalWithAddons = baseItemTotal + addonPrice;
  const serviceTax = Math.round(totalWithAddons * 0.09);
  const gst = Math.round(totalWithAddons * 0.12);
  const totalPrice = totalWithAddons + serviceTax + gst;

  existingPayload.message.order.items = selectItems.map((item: any) => ({
    id: item.id,
    add_ons: item.add_ons,
    payment_ids: [catalogItems[0]?.payment_ids?.[0]],
  }));

  existingPayload.message.order.quote = {
    price: {
      currency: "INR",
      value: totalPrice.toFixed(2),
    },
    breakup: [
      {
        item: {
          id: selectedItemId ?? "Accommodation-1",
          quantity: selectItems[0]?.quantity ?? {
            selected: {
              count: 1,
            },
          },
          price: {
            currency: "INR",
            value: itemPrice.toFixed(2),
          },
          // Only include add_ons when user actually selected them
          ...(selectItems[0]?.add_ons?.length
            ? {
                add_ons: [
                  {
                    id: selectedAddonId,
                    price: {
                      currency: "INR",
                      value: addonPrice.toFixed(2),
                    },
                  },
                ],
              }
            : {}),
        },
        title: selectItems[0]?.add_ons?.length
          ? (catalogItem?.descriptor?.name ?? "Deluxe Room accommodation with all meals included")
          : "Deluxe Room accommodation",
        price: {
          currency: "INR",
          value: totalWithAddons.toFixed(2),
        },
      },
      {
        title: "Service Tax @ 9%",
        price: {
          currency: "INR",
          value: serviceTax.toString(),
        },
      },
      {
        title: "GST @ 12%",
        price: {
          currency: "INR",
          value: gst.toString(),
        },
      },
    ],
    ttl: "P1D",
  };



  // Calculate payment amounts from quote total
  const advanceDepositAmount = (totalPrice * 0.5).toFixed(2); // 50% advance
  const finalPaymentAmount = (totalPrice * 0.5).toFixed(2); // 50% remaining

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

  const paymentIds = catalogItems[0]?.payment_ids ?? [];

  existingPayload.message.order.payments.forEach(
    (payment: any, index: number) => {
      if (index < paymentIds.length) {
        payment.id = paymentIds[index];
      }
    }
  );

  return existingPayload;
}
