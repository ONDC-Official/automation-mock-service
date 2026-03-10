export async function onSelectDefaultGenerator(
  existingPayload: any,
  sessionData: any,
) {
  existingPayload.message.order.provider.id =
    sessionData?.select_provider_id ?? "P1";

  const selectItems = sessionData?.select_items?.flat() ?? [];
  // Use on_search_1_items (from on_search_6) with fallback to on_search_5_items
  const catalogItems =
    sessionData?.on_search_1_items?.flat() ??
    sessionData?.on_search_5_items?.flat() ??
    [];

  // Helper: find catalog entry for a given item id
  const findCatalogItem = (id: string) =>
    catalogItems.find((ci: any) => ci.id === id) ?? catalogItems[0] ?? null;

  // First catalog item — used as fallback for payment_ids normalization
  const firstCatalogItem = findCatalogItem(selectItems[0]?.id);

  existingPayload.message.order.items = selectItems.map((item: any) => {
    const itemHasAddOns =
      Array.isArray(item.add_ons) && item.add_ons.length > 0;
    const cat = findCatalogItem(item.id);
    return {
      id: item.id,
      ...(itemHasAddOns ? { add_ons: item.add_ons } : {}),
      payment_ids: cat?.payment_ids?.[0] ? [cat.payment_ids[0]] : [],
    };
  });

  // Build one breakup entry per selected item
  const itemBreakups = selectItems.map((item: any) => {
    const cat = findCatalogItem(item.id);
    const price = Number(cat?.price?.value ?? "2000.00");
    const hasAddOns = Array.isArray(item.add_ons) && item.add_ons.length > 0;
    return {
      item: {
        id: item.id,
        quantity: item.quantity ?? { selected: { count: 1 } },
        price: {
          currency: "INR",
          value: price.toFixed(2),
        },
        ...(hasAddOns
          ? {
              add_ons: item.add_ons.map((addon: any) => {
                const catalogAddon = cat?.add_ons?.find(
                  (a: any) => a.id === addon.id,
                );
                return {
                  id: addon.id,
                  price: {
                    currency: catalogAddon?.price?.currency ?? "INR",
                    value: catalogAddon?.price?.value ?? "0.00",
                  },
                };
              }),
            }
          : {}),
      },
      title: hasAddOns
        ? "Deluxe Room accommodation with all meals included (breakfast, lunch, and dinner)"
        : "Deluxe Room accommodation",
      price: {
        currency: "INR",
        value: "0.00", // will be recalculated below
      },
    };
  });

  existingPayload.message.order.quote = {
    price: {
      currency: "INR",
      value: "0.00", // will be recalculated below
    },
    breakup: [
      ...itemBreakups,
      {
        title: "Service Tax @ 9%",
        price: {
          currency: "INR",
          value: "0.00",
        },
      },
      {
        title: "GST @ 12%",
        price: {
          currency: "INR",
          value: "0.00",
        },
      },
    ],
    ttl: "P1D",
  };

  let totalPrice = 0;
  let itemSubtotal = 0;

  existingPayload.message.order.quote.breakup.forEach((breakup: any) => {
    if (breakup.item) {
      let itemPrice =
        Number(breakup.item.price.value) *
        Number(breakup.item.quantity?.selected?.count ?? 1);

      if (breakup.item.add_ons?.length) {
        itemPrice += breakup.item.add_ons.reduce(
          (sum: number, addon: any) => sum + Number(addon.price.value),
          0,
        );
      }

      breakup.price.value = itemPrice.toString();
      totalPrice += itemPrice;
      itemSubtotal += itemPrice; // accumulate ALL items before tax lines run
    } else {
      // Parse percentage from title e.g. "Service Tax @ 9%" → 9, "GST @ 12%" → 12
      const pctMatch = breakup.title?.match(/(\d+(?:\.\d+)?)%/);
      if (pctMatch) {
        const taxAmount =
          Math.round(((itemSubtotal * Number(pctMatch[1])) / 100) * 100) / 100;
        breakup.price.value = taxAmount.toFixed(2);
        totalPrice += taxAmount;
      } else {
        totalPrice += Number(breakup.price.value);
      }
    }
  });

  existingPayload.message.order.quote.price.value = totalPrice.toString();

  // Calculate payment amounts proportionally from dynamic quote total
  // Original ratio: advance deposit is 2000/3025 of total, remaining is 1025/3025
  const advanceDepositRatio = 2000 / 3025;
  const advanceAmount =
    Math.round(totalPrice * advanceDepositRatio * 100) / 100;
  const remainingAmount = Math.round((totalPrice - advanceAmount) * 100) / 100;

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
              value: advanceAmount.toFixed(2),
            },
            {
              descriptor: {
                code: "pymnt-5",
              },
              value: remainingAmount.toFixed(2),
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
        amount: advanceAmount.toFixed(2),
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
        amount: remainingAmount.toFixed(2),
        currency: "INR",
      },
    },
  ];

  const paymentIds = firstCatalogItem?.payment_ids ?? [];

  existingPayload.message.order.payments.forEach(
    (payment: any, index: number) => {
      if (index < paymentIds.length) {
        payment.id = paymentIds[index];
      }
    },
  );

  existingPayload.message.order.cancellation_terms = [
    {
      cancellation_fee: {
        percentage: "10",
      },
      cancel_by: {
        range: {
          start: new Date().toISOString(),
          end: new Date().toISOString(),
        },
      },
      cancellation_eligible: true,
    },
  ];

  // Apply INCLUSIONS / EXCLUSIONS tags to every selected item
  const itemTags = [
    {
      descriptor: {
        code: "INCLUSIONS",
        name: "Inclusions",
      },
      display: true,
      list: [
        { descriptor: { code: "PATIO" } },
        { descriptor: { code: "LAWN" } },
        { descriptor: { code: "GARDEN" } },
        { descriptor: { code: "PICNIC_AREA" } },
      ],
    },
    {
      descriptor: {
        code: "EXCLUSIONS",
        name: "Exclusions",
      },
      display: true,
      list: [
        { descriptor: { code: "OUTDOOR_FURNITURE" } },
        { descriptor: { code: "SUN_DECK" } },
        { descriptor: { code: "SUN_BEDS" } },
        { descriptor: { code: "BEACH_BEDS" } },
      ],
    },
  ];

  existingPayload.message.order.items.forEach((item: any) => {
    item.tags = itemTags;
  });

  existingPayload.message.order.provider.tags = [
    {
      descriptor: {
        code: "INCLUSIONS",
        name: "Inclusions",
      },
      display: true,
      list: [
        {
          descriptor: {
            code: "FREE_TOILETRIES",
          },
        },
        {
          descriptor: {
            code: "IRONING_FACILITIES",
          },
        },
        {
          descriptor: {
            code: "LAN",
          },
        },
        {
          descriptor: {
            code: "HAIR_DRYER",
          },
        },
      ],
    },
    {
      descriptor: {
        code: "EXCLUSIONS",
        name: "Exclusions",
      },
      display: true,
      list: [
        {
          descriptor: {
            code: "MICROWAVE",
          },
        },
        {
          descriptor: {
            code: "REFRIGERATOR",
          },
        },
        {
          descriptor: {
            code: "WASHING_MACHINE",
          },
        },
        {
          descriptor: {
            code: "COOKING_APPLIANCES",
          },
        },
      ],
    },
  ];

  return existingPayload;
}
