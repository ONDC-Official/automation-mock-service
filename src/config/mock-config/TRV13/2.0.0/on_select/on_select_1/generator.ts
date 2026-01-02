export async function onSelectDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;

  existingPayload.message.order.provider.id =
    sessionData?.select_provider_id ?? "P1";

  const selectItems = sessionData?.select_items[0] ?? [];
  const catalogItems = sessionData?.on_search_1_items[0] ?? [];

  // Find selected item in catalog to get actual prices
  const selectedItemId = selectItems[0]?.id;
  const catalogItem = catalogItems.find((item: any) => item.id === selectedItemId) ?? catalogItems[0];
  
  // Get item price from catalog
  const itemPrice = Number(catalogItem?.price?.value ?? "2000.00");
  const quantity = parseInt(selectItems[0]?.quantity?.selected?.count) || 1;
  
  // Get selected addon and its price from catalog
  const selectedAddonId = selectItems[0]?.add_ons?.[0]?.id;
  const catalogAddon = catalogItem?.add_ons?.find((a: any) => a.id === selectedAddonId);
  const addonPrice = Number(catalogAddon?.price?.value ?? "500.00");
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
          quantity: {
            selected: {
              count: quantity,
            },
          },
          price: {
            currency: "INR",
            value: itemPrice.toFixed(2),
          },
          add_ons: [
            {
              id: selectedAddonId ?? "full-board",
              price: {
                currency: "INR",
                value: addonPrice.toFixed(2),
              },
            },
          ],
        },
        title: catalogItem?.descriptor?.name ?? "Deluxe Room accommodation with all meals included",
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
