interface Tag {
  code: string;
  list: { code: string; value: string }[];
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getTimestampFromDuration(
  date: string | Date,
  duration: string
): string {
  console.log("duratioN", duration);
  const durationRegex = /P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
  const match = duration.match(durationRegex);

  if (!match) {
    throw new Error("Invalid ISO 8601 duration format");
  }

  const days = match[1] ? parseInt(match[1], 10) || 0 : 0;
  const hours = match[2] ? parseInt(match[2], 10) || 0 : 0;
  const minutes = match[3] ? parseInt(match[3], 10) || 0 : 0;
  const seconds = match[4] ? parseInt(match[4], 10) || 0 : 0;

  const futureDate = new Date(date);
  futureDate.setDate(futureDate.getDate() + days);
  futureDate.setHours(futureDate.getHours() + hours);
  futureDate.setMinutes(futureDate.getMinutes() + minutes);
  futureDate.setSeconds(futureDate.getSeconds() + seconds);

  return futureDate.toISOString();
}

export function removeTagsByCodes(tags: any[], codesToRemove: string[]): Tag[] {
  if (!tags) return [];
  return tags.filter((tag) => !codesToRemove.includes(tag.code));
}

export function getFutureDate(
  daysAhead: number,
  inISO: boolean = false
): string {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  if (inISO) {
    return futureDate.toISOString();
  }

  return futureDate.toISOString().split("T")[0];
}

export function isEmpty(obj: any) {
  return Object.keys(obj).length === 0;
}

export const getFutureDateInMinutes = (minutes: number): string => {
  const now = new Date();
  const future = new Date(now.getTime() + minutes * 60 * 1000);
  return future.toISOString();
};

export const TatMapping: any = {
  "Immediate Delivery": {
    code: "PT60M",
    day: 0,
    pickupTime: "PT15M",
    orderPrepTime: "PT10M",
  },
  "Same Day Delivery": {
    code: "PT4H",
    day: 0,
    pickupTime: "PT1H",
    orderPrepTime: "PT1H",
  },
  "Next Day Delivery": {
    code: "P1D",
    day: 1,
    pickupTime: "PT4H",
    orderPrepTime: "PT4H",
  },
  "Standard Delivery": {
    code: "P2D",
    day: 2,
    pickupTime: "PT12H",
    orderPrepTime: "PT12H",
  },
  "Express Delivery": {
    code: "P3D",
    day: 2,
    pickupTime: "P1D",
    orderPrepTime: "P1D",
  },
  "Instant Delivery": {
    code: "PT10M",
    day: 0,
    pickupTime: "PT2M",
    orderPrepTime: "PT2M",
  },
};

export const calculateQuotePrice = (breakup: any) => {
  let totalPrice = 0;
  breakup.forEach((item: any) => {
    totalPrice += parseFloat(item.price.value) || 0;
  });

  return totalPrice.toFixed(2); // returns a string with 2 decimal places
};

export const generateQuoteTrail = (
  breakup: any,
  items: any,
  options: any,
  parentItemId?: string
) => {
  const {
    fulfillmentState = "PRE",
    isRTO = false,
    partCancel = false,
  } = options;
  const quoteTrailTags: any[] = [];

  function extractType(tags: any) {
    if (!tags) return null;
    const typeTag = tags.find((tag: any) => tag.code === "type");
    if (!typeTag || !typeTag.list) return null;

    const typeItem = typeTag.list.find((item: any) => item.code === "type");
    return typeItem ? typeItem.value : null;
  }

  breakup.forEach((item: any) => {
    if (
      item["@ondc/org/title_type"] === "delivery" ||
      item["@ondc/org/title_type"] === "packing"
    ) {
      if (fulfillmentState === "PRE" && !partCancel) {
        quoteTrailTags.push({
          code: "quote_trail",
          list: [
            {
              code: "type",
              value: item["@ondc/org/title_type"],
            },
            {
              code: "id",
              value: item["@ondc/org/item_id"],
            },
            {
              code: "currency",
              value: "INR",
            },
            {
              code: "value",
              value: `-${item.price.value}`,
            },
          ],
        });
      }
    } else if (item["@ondc/org/title_type"] === "offer") {
      quoteTrailTags.push({
        code: "quote_trail",
        list: [
          {
            code: "type",
            value: item["@ondc/org/title_type"],
          },
          {
            code: "id",
            value: item["@ondc/org/item_id"],
          },
          {
            code: "currency",
            value: "INR",
          },
          {
            code: "value",
            value: `${Math.abs(parseInt(item.price.value))}`,
          },
        ],
      });
    } else if (
      (!parentItemId || item?.item?.parent_item_id === parentItemId)
    ) {
      const matchedItem = items.find(
        (allItem: any) => allItem.id === item["@ondc/org/item_id"]
      );
      const subType = matchedItem ? extractType(matchedItem?.tags) : null;

      const list: any[] = [
        {
          code: "type",
          value: item["@ondc/org/title_type"],
        },
      ];

      if (subType) {
        list.push({
          code: "subtype",
          value: subType,
        });
      }

      list.push(
        {
          code: "id",
          value: item["@ondc/org/item_id"],
        },
        {
          code: "currency",
          value: "INR",
        },
        {
          code: "value",
          value: `-${Number(item.price.value).toFixed(2)}`,
        }
      );

      quoteTrailTags.push({
        code: "quote_trail",
        list: list,
      });
    }
  });

  // if (isRTO) {
  //   quoteTrailTags.push({
  //     code: "quote_trail",
  //     list: [
  //       {
  //         code: "type",
  //         value: "delivery",
  //       },
  //       {
  //         code: "id",
  //         value: "F1-RTO",
  //       },
  //       {
  //         code: "currency",
  //         value: "INR",
  //       },
  //       {
  //         code: "value",
  //         value: `50`,
  //       },
  //     ],
  //   });
  // }

  return quoteTrailTags;
};

export const buildRetailQuote = (
  items: any,
  initalItems: any,
  fulfillments: any,
  options?: any
) => {
  const quote: any = {};
  let breakup: any = [];
  let totalPrice = 0.0;

  function extractTags(tags: any) {
    if (!tags) return {};
    const result: any = {};

    tags.forEach((tag: any) => {
      const section = tag.code;
      if (section === "qualifier" || section === "benefit") {
        result[section] = {};
        tag.list.forEach((item: any) => {
          result[section][item.code] = item.value;
        });
      }
    });

    return result;
  }
  let hasCancelFulfillment = false;
  const processed = new Set();

  items.forEach((item: any) => {
    let isCancelFulfillment = false;
    let isRTO = false;
    let isReturn = false;
    console.log("items: ", item);
    const uniqueKey = `${item.id}_${item.parent_item_id || 'root'}`;
    if (item.quantity?.count === 0 || item.fulfillment_id?.includes("cancel") || processed.has(uniqueKey)) {
      return;
    }
    processed.add(uniqueKey);

    const initialItemsData: any = initalItems?.find(
      (on_search_item: any) => on_search_item.id === item.id
    );

    if (!initialItemsData) return;

    fulfillments.forEach((fulfillment: any) => {
      if (
        fulfillment.id === item?.fulfillment_id &&
        fulfillment.type === "Cancel"
      ) {
        isCancelFulfillment = true;
      } else if (fulfillment.type === "RTO") {
        isRTO = true;
      } else if (fulfillment.type === "Return") {
        isReturn = true;
      }
    });

    const quantity = options?.cancelled || isCancelFulfillment || isRTO || (options?.returnParentItemId && item.parent_item_id === options.returnParentItemId) ? 0 : (item.quantity?.count ?? 1);
    
    const unitPrice = parseFloat(initialItemsData.price?.value ?? "0");
    const totalItemPrice = unitPrice * quantity;

    totalPrice += totalItemPrice;

    breakup.push({
      "@ondc/org/item_id": item.id,
      "@ondc/org/item_quantity": {
        count: quantity,
      },
      title: initialItemsData.descriptor?.name || "Item",
      "@ondc/org/title_type": "item",
      price: {
        currency: "INR",
        value: totalItemPrice.toFixed(2),
      },
      item: {
        ...(item.parent_item_id ? { parent_item_id: item.parent_item_id } : {}),
        quantity: {
          available: {
            count: initialItemsData.quantity?.available?.count || "99",
          },
          maximum: {
            count: initialItemsData.quantity?.maximum?.count || "99",
          },
        },
        price: {
          currency: "INR",
          value: initialItemsData.price?.value || "0.00",
        },
        tags: removeTagsByCodes(item?.tags || [], ["rto_action"]),
      },
    });

    const taxPrice = (totalItemPrice * 0.05).toFixed(2).toString();

    totalPrice += parseFloat(taxPrice);

    if (options?.search_bap_terms?.list?.some((t: any) => t.code === "00A")) {
      const npFeesbreakup = [
        {
          "@ondc/org/item_id": item.id,
          title: "Convenience Fee",
          "@ondc/org/title_type": "misc",
          price: { currency: "INR", value: "0.50" },
          item: {
            tags: [
              { code: "quote", list: [{ code: "type", value: "item" }] },
              {
                code: "np_fees",
                list: [
                  { code: "id", value: "1" },
                  { code: "channel_margin_type", value: "percent" },
                  { code: "channel_margin_value", value: "0.50" },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": item.id,
          title: "Convenience Fee",
          "@ondc/org/title_type": "misc",
          price: { currency: "INR", value: "7.00" },
          item: {
            tags: [
              { code: "quote", list: [{ code: "type", value: "item" }] },
              {
                code: "np_fees",
                list: [
                  { code: "id", value: "2" },
                  { code: "channel_margin_type", value: "amount" },
                  { code: "channel_margin_value", value: "7.00" },
                ],
              },
            ],
          },
        },
        {
          "@ondc/org/item_id": item.id,
          title: "Tax",
          "@ondc/org/title_type": "tax",
          price: { currency: "INR", value: "0.09" },
          item: {
            parent_item_id: item.parent_item_id,
            tags: [
              {
                code: "quote",
                list: [
                  { code: "type", value: "item" },
                  { code: "subtype", value: "misc" },
                ],
              },
              { code: "np_fees", list: [{ code: "id", value: "1" }] },
            ],
          },
        },
        {
          "@ondc/org/item_id": item.id,
          title: "Tax",
          "@ondc/org/title_type": "tax",
          price: { currency: "INR", value: "1.26" },
          item: {
            parent_item_id: item.parent_item_id,
            tags: [
              {
                code: "quote",
                list: [
                  { code: "type", value: "item" },
                  { code: "subtype", value: "misc" },
                ],
              },
              { code: "np_fees", list: [{ code: "id", value: "2" }] },
            ],
          },
        },
      ];

      npFeesbreakup.forEach((fee) => {
        breakup.push(fee);
        totalPrice += parseFloat(fee.price.value);
      });
    }



    breakup.push({
      "@ondc/org/item_id": item.id,
      title: "Tax",
      "@ondc/org/title_type": "tax",
      price: {
        currency: "INR",
        value: taxPrice,
      },
      item: {
        ...(item.parent_item_id ? { parent_item_id: item.parent_item_id } : {}),
        tags: removeTagsByCodes(item?.tags || [], ["rto_action"]),
      },
    });
    if (isCancelFulfillment) {
      hasCancelFulfillment = true;
    }
  });

  options?.offers?.forEach((offer: any) => {
    options?.initalOffers?.forEach((initOffer: any) => {
      if (initOffer.id === offer.id) {
        const conditions = extractTags(initOffer?.tags);

        if (parseInt(conditions?.qualifier?.min_value) > totalPrice) {
          return;
        }

        const benifitType = conditions?.benefit?.value_type;

        let price = "";

        if (benifitType === "amount") {
          price = conditions?.benefit?.value;

          totalPrice += parseInt(conditions?.benefit?.value || "0");
        }

        if (benifitType === "percent") {
          const percent =
            Math.abs(parseFloat(conditions?.benefit?.value)) / 100;
          const cap = Math.abs(parseFloat(conditions?.benefit?.value_cap));
          const calculatedDiscount = totalPrice * percent;

          const finalDiscount = Math.min(calculatedDiscount, cap);

          totalPrice -= finalDiscount;

          price = `-${finalDiscount.toFixed(2)}`;
        }

        breakup.push({
          "@ondc/org/item_id": offer.id,
          title: "offer",
          "@ondc/org/title_type": "offer",
          price: {
            currency: "INR",
            value: price,
          },
          item: {
            tags: [
              {
                code: "quote",
                list: [
                  {
                    code: "type",
                    value: "order",
                  },
                ],
              },
              {
                code: "offer",
                list: [
                  {
                    code: "type",
                    value: "discount",
                  },
                  {
                    code: "additive",
                    value: "yes",
                  },
                  {
                    code: "auto",
                    value: "no",
                  },
                ],
              },
            ],
          },
        });
      }
    });
  });

  let deliveryBreakup: any[] = [];

  if ((!hasCancelFulfillment || options?.partCancel) && options?.fulfillmentState !== "PRE") {
    fulfillments.forEach((fulfillment: any) => {
      if (fulfillment.type === "Delivery") {
        let deliveryCost = 50;
        let packingCost = 25;
        if (fulfillment["@ondc/org/TAT"] === "PT30M") {
          deliveryCost = 60;
        }

        totalPrice += (deliveryCost + packingCost + 9 + 10);
        
        deliveryBreakup = [
          ...deliveryBreakup,
          {
            "@ondc/org/item_id": fulfillment.id,
            title: "Delivery charges",
            "@ondc/org/title_type": "delivery",
            price: {
              currency: "INR",
              value: deliveryCost.toFixed(2),
            },
          },
          {
            "@ondc/org/item_id": fulfillment.id,
            title: "Tax",
            "@ondc/org/title_type": "tax",
            price: {
              currency: "INR",
              value: "9.00",
            },
            item: {
              tags: [
                {
                  code: "quote",
                  list: [{ code: "type", value: "fulfillment" }],
                },
              ],
            },
          },
          {
            "@ondc/org/item_id": fulfillment.id,
            title: "Packing charges",
            "@ondc/org/title_type": "packing",
            price: {
              currency: "INR",
              value: packingCost.toFixed(2),
            },
          },
          {
            "@ondc/org/item_id": fulfillment.id,
            title: "Convenience Fee",
            "@ondc/org/title_type": "misc",
            price: {
              currency: "INR",
              value: "10.00",
            },
          },
        ];
      } else if (fulfillment.type === "Buyer-Delivery") {
        totalPrice += 25;
        deliveryBreakup = [
          ...deliveryBreakup,
          {
            "@ondc/org/item_id": fulfillment.id,
            title: "Delivery charges",
            "@ondc/org/title_type": "delivery",
            price: {
              currency: "INR",
              value: "0.00",
            },
          },
          {
            "@ondc/org/item_id": fulfillment.id,
            title: "Packing charges",
            "@ondc/org/title_type": "packing",
            price: {
              currency: "INR",
              value: "25.00",
            },
          },
        ];
      } else if (fulfillment.type === "Self-Pickup") {
        totalPrice += 25;
        deliveryBreakup = [
          ...deliveryBreakup,
          {
            "@ondc/org/item_id": fulfillment.id,
            title: "Delivery charges",
            "@ondc/org/title_type": "delivery",
            price: {
              currency: "INR",
              value: "0.00",
            },
          },
          {
            "@ondc/org/item_id": fulfillment.id,
            title: "Packing charges",
            "@ondc/org/title_type": "packing",
            price: {
              currency: "INR",
              value: "25.00",
            },
          },
        ];
      } else if (fulfillment.type === "RTO") {
        totalPrice += 55;
        deliveryBreakup = [
          ...deliveryBreakup,
          {
            "@ondc/org/item_id": fulfillment.id,
            title: "Delivery charges",
            "@ondc/org/title_type": "delivery",
            price: {
              currency: "INR",
              value: "55.00",
            },
          },
        ];
      }
    });
  }

  breakup = [...breakup, ...deliveryBreakup];

  quote.price = {
    currency: "INR",
    value: totalPrice.toFixed(2).toString(),
  };

  quote.breakup = breakup;
  quote.ttl = "P1D";

  return quote;
};


export function getUpdatedBilling(savedBilling: any, initialize = false) {
	if (initialize) {
		const newIso = new Date(new Date().getTime() - 5 * 1000).toISOString();
		savedBilling.created_at = newIso;
		savedBilling.updated_at = newIso;
	}
	return savedBilling;
}
