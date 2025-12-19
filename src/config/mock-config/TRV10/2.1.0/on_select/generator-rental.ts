import { SessionData } from "../../session-types";
const item_tags = [
  {
    descriptor: {
      code: "FARE_POLICY",
      name: "Daytime Charges",
    },
    display: true,
    list: [
      {
        descriptor: {
          code: "MIN_FARE",
        },
        value: "30",
      },
      {
        descriptor: {
          code: "MIN_FARE_DISTANCE_KM",
        },
        value: "2",
      },
      {
        descriptor: {
          code: "PER_KM_CHARGE",
        },
        value: "15",
      },
      {
        descriptor: {
          code: "PICKUP_CHARGE",
        },
        value: "10",
      },
      {
        descriptor: {
          code: "WAITING_CHARGE_PER_MIN",
        },
        value: "2",
      },
      {
        descriptor: {
          code: "NIGHT_CHARGE_MULTIPLIER",
        },
        value: "1.5",
      },
      {
        descriptor: {
          code: "NIGHT_SHIFT_START_TIME",
        },
        value: "22:00:00",
      },
      {
        descriptor: {
          code: "NIGHT_SHIFT_END_TIME",
        },
        value: "05:00:00",
      },
    ],
  },
  {
    descriptor: {
      code: "INFO",
      name: "General Information",
    },
    display: true,
    list: [
      {
        descriptor: {
          code: "TOTAL_HOURS",
        },
        value: "1",
      },
      {
        descriptor: {
          code: "TOTAL_DISTANCE",
        },
        value: "10",
      },
    ],
  },
];

function updateQuoteWithAddOns(quote: any, items: any[]) {
  if (!quote || !items?.length) return quote;

  let addOnTotal = 0;
  const addOnBreakups: any[] = [];

  items.forEach((item) => {
    const addOns = item.add_ons
      ?.map((a: any) => {
        const count = a.quantity?.selected?.count || 0;
        if (!count) return null;

        addOnTotal += Number(a.price.value) * count;

        return {
          id: a.id,
          price: a.price,
          quantity: { selected: { count } },
        };
      })
      .filter(Boolean);

    if (addOns?.length) {
      addOnBreakups.push({
        title: "ADD_ONS",
        item: { id: item.id, add_ons: addOns },
        price: { currency: "INR", value: String(addOnTotal) },
      });
    }
  });

  const breakup = quote.breakup.filter((b: any) => b.title !== "ADD_ONS");
  const baseTotal = breakup.reduce(
    (sum: any, b: any) => sum + Number(b.price?.value || 0),
    0
  );

  return {
    ...quote,
    breakup: [...breakup, ...addOnBreakups],
    price: { currency: "INR", value: String(baseTotal + addOnTotal) },
    ttl: "PT30S",
  };
}

function transformTags(tags: any, quantity: any) {
  const updatedTags = JSON.parse(JSON.stringify(tags)); // deep clone

  for (const tag of updatedTags) {
    if (tag.descriptor.code === "INFO" && Array.isArray(tag.list)) {
      for (const item of tag.list) {
        if (
          ["TOTAL_HOURS", "TOTAL_DISTANCE"].indexOf(item.descriptor.code) !== -1
        ) {
          const originalValue = parseFloat(item.value);
          if (!isNaN(originalValue)) {
            item.value = (originalValue * quantity).toString();
          }
        }
      }
    }
  }

  return updatedTags;
}
function generateQuoteFromItems(items: any[]) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return {
    breakup: items
      .map((item) => {
        const price = parseFloat(item.price.value);
        const minFare = parseFloat(
          item.tags
            .find((tag: any) => tag.descriptor.code === "FARE_POLICY")
            ?.list.find((t: any) => t.descriptor.code === "MIN_FARE")?.value ||
            "0"
        );

        const distanceFare = price - minFare;

        return [
          {
            price: {
              currency: item.price.currency,
              value: minFare.toString(),
            },
            title: "BASE_FARE",
          },
          {
            price: {
              currency: item.price.currency,
              value: distanceFare.toString(),
            },
            title: "DISTANCE_FARE",
          },
        ];
      })
      .reduce((acc, val) => acc.concat(val), []),

    price: {
      currency: items[0].price.currency,
      value: items
        .reduce((total, item) => total + parseFloat(item.price.value), 0)
        .toString(),
    },
    ttl: "PT200S",
  };
}
function filterFulfillmentsByItem(item: any, fulfillments: any[]) {
  if (!item?.fulfillment_ids || !Array.isArray(fulfillments)) {
    return [];
  }

  return fulfillments.filter((fulfillment) =>
    item.fulfillment_ids.includes(fulfillment.id)
  );
}

function filterItemsById(sessionData: any, selected_item_id: string) {
  if (sessionData?.items && Array.isArray(sessionData.items)) {
    return sessionData.items.filter(
      (item: any) => item.id === selected_item_id
    );
  }
  return [];
}
function generateAddOnQuote(addOn: any, items: any[]) {
  for (const item of items) {
    const foundAddOn = item.add_ons.find((a: any) => a.id === addOn.id);
    if (foundAddOn) {
      // Extract price and calculate total
      const pricePerUnit = parseFloat(foundAddOn.price.value);
      const quantity = addOn.quantity.selected.count;
      const totalPrice = pricePerUnit * quantity;

      // Return the formatted output
      return {
        title: "ADD_ONS",
        item: {
          id: item.id,
          add_ons: [
            {
              id: foundAddOn.id,
              price: {
                currency: foundAddOn.price.currency,
                value: foundAddOn.price.value,
              },
              quantity: {
                selected: {
                  count: quantity,
                },
              },
            },
          ],
        },
        price: {
          currency: foundAddOn.price.currency,
          value: totalPrice.toFixed(2),
        },
      };
    }
  }

  return null; // Return null if no matching add-on is found
}

function appendAddOns(item: any, sessionData: SessionData) {
  const updatedSessionItems = sessionData.selected_items?.flat();
  const currentItem = updatedSessionItems?.find((i: any) => i.id === item.id);

  if (!currentItem?.add_ons?.length) {
    return [];
  }

  const fullItem = sessionData.items?.find((it: any) => it.id === item.id);
  if (!fullItem?.add_ons?.length) {
    return [];
  }

  const resolvedAddOns = currentItem.add_ons
    .map((selectedAddOn: any) => {
      const fullAddOn = fullItem.add_ons.find(
        (ao: any) => ao.id === selectedAddOn.id
      );

      if (!fullAddOn) return null;

      const addOn = {
        ...fullAddOn,
        quantity: {
          selected: {
            count: selectedAddOn.quantity.selected.count,
          },
          unitized: fullAddOn?.quantity?.unitized,
        },
      };

      delete addOn?.descriptor;
      return addOn;
    })
    .filter(Boolean);

  return resolvedAddOns;
}

export async function onSelectMultipleStopsRentalGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  const selected_item_id = sessionData.selected_item_id;
  const item = filterItemsById(sessionData, selected_item_id);
  existingPayload.message.order.items = item;
  if (sessionData.updated_price) {
    existingPayload.message.order.items[0].price.value =
      sessionData.updated_price;
  }

  existingPayload.message.order.items.map((item: any) => {
    if (Array.isArray(item.tags)) {
      item.tags = item_tags;
    }

    const addOn = appendAddOns(item, sessionData);
    item.add_ons = addOn;
    return item;
  });
  const filteredFulfillments = filterFulfillmentsByItem(
    item[0],
    sessionData.fulfillments
  );
  existingPayload.message.order.quote = generateQuoteFromItems(item);
      existingPayload.message.order.quote = updateQuoteWithAddOns(
      existingPayload.message.order.quote,
      existingPayload.message.order.items
    );
  existingPayload.message.order.fulfillments = filteredFulfillments;
  if (sessionData.cancellation_terms) {
    existingPayload.message.order.cancellation_terms =
      sessionData.cancellation_terms[0];
  }
  return existingPayload;
}
