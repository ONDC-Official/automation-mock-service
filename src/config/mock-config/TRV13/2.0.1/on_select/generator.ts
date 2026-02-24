export async function onSelectDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {

  existingPayload.message.order.provider.id =
    sessionData?.select_provider_id ?? "P1";

  const selectItems = sessionData?.select_items?.flat() ?? [];
  // Use on_search_1_items (from on_search_6) with fallback to on_search_5_items
  const on_search_5_item = sessionData?.on_search_1_items?.flat() ?? sessionData?.on_search_5_items?.flat() ?? [];

  // Find the catalog item matching the selected item to get its real price
  const selectedItemId = selectItems[0]?.id;
  const catalogItem = on_search_5_item.find((item: any) => item.id === selectedItemId)
    ?? on_search_5_item[0];
  const itemPrice = Number(catalogItem?.price?.value ?? "2000.00");

  existingPayload.message.order.items = selectItems.map((item: any) => {
    const itemHasAddOns = Array.isArray(item.add_ons) && item.add_ons.length > 0;
    return {
      id: item.id,
      ...(itemHasAddOns ? { add_ons: item.add_ons } : {}),
      payment_ids: catalogItem?.payment_ids?.[0]
        ? [catalogItem.payment_ids[0]]
        : [],
    };
  });

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
            value: itemPrice.toFixed(2),
          },
          // Only include add_ons when the user actually selected them
          ...(selectItems[0]?.add_ons?.length
            ? {
                add_ons: selectItems[0].add_ons.map((addon: any) => {
                  const catalogAddon = catalogItem?.add_ons?.find(
                    (a: any) => a.id === addon.id
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
        title: selectItems[0]?.add_ons?.length
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
  let itemSubtotal = 0;

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
      itemSubtotal = itemPrice; // capture for percentage-based tax lines below
    } else {
      // Parse percentage from title e.g. "Service Tax @ 9%" → 9, "GST @ 12%" → 12
      const pctMatch = breakup.title?.match(/(\d+(?:\.\d+)?)%/);
      if (pctMatch) {
        const taxAmount =
          Math.round((itemSubtotal * Number(pctMatch[1])) / 100 * 100) / 100;
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
  const advanceAmount = Math.round(totalPrice * advanceDepositRatio * 100) / 100;
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

  const paymentIds = catalogItem?.payment_ids ?? [];

  existingPayload.message.order.payments.forEach(
    (payment: any, index: number) => {
      if (index < paymentIds.length) {
        payment.id = paymentIds[index];
      }
    }
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

  existingPayload.message.order.items[0].tags = [
    {
      descriptor: {
        code: "INCLUSIONS",
        name: "Inclusions",
      },
      display: true,
      list: [
        {
          descriptor: {
            code: "PATIO",
          },
        },
        {
          descriptor: {
            code: "LAWN",
          },
        },
        {
          descriptor: {
            code: "GARDEN",
          },
        },
        {
          descriptor: {
            code: "PICNIC_AREA",
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
            code: "OUTDOOR_FURNITURE",
          },
        },
        {
          descriptor: {
            code: "SUN_DECK",
          },
        },
        {
          descriptor: {
            code: "SUN_BEDS",
          },
        },
        {
          descriptor: {
            code: "BEACH_BEDS",
          },
        },
      ],
    },
  ];

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
