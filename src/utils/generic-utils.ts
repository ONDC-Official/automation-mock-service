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
  return tags.filter((tag) => !codesToRemove.includes(tag.code));
}

export function getFutureDate(daysAhead: number): string {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

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
  options: any,
  parentItemId?: string
) => {
  const { fulfillmentState = "PRE", isRTO = false } = options;
  const quoteTrailTags: any[] = [];

  breakup.forEach((item: any) => {
    if (
      item["@ondc/org/title_type"] === "delivery" ||
      item["@ondc/org/title_type"] === "packing"
    ) {
      if (fulfillmentState === "PRE") {
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
      parseInt(item.price.value) !== 0 &&
      (!parentItemId || item?.item?.parent_item_id === parentItemId)
    ) {
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
  });

  if (isRTO) {
    quoteTrailTags.push({
      code: "quote_trail",
      list: [
        {
          code: "type",
          value: "delivery",
        },
        {
          code: "id",
          value: "F1-RTO",
        },
        {
          code: "currency",
          value: "INR",
        },
        {
          code: "value",
          value: `50`,
        },
      ],
    });
  }

  return quoteTrailTags;
};

export const buildRetailQuote = (
  items: any,
  initalItems: any,
  fulfillments: any,
  offersData?: any
) => {
  const quote: any = {};
  let breakup: any = [];
  let totalPrice = 0;

  function extractTags(tags: any) {
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

  items.forEach((item: any) => {
    const initialItemsData: any = initalItems?.find(
      (on_search_item: any) => on_search_item.id === item.id
    );

    let isCancelFulfillment = false;
    let isRTO = false;

    fulfillments.forEach((fulfillment: any) => {
      if (
        fulfillment.id === item?.fulfillment_id &&
        fulfillment.type === "Cancel"
      ) {
        isCancelFulfillment = true;
      } else if (fulfillment.type === "RTO") {
        isRTO = true;
      }
    });

    const itemPrice =
      parseInt(initialItemsData.price.value) *
      (isCancelFulfillment || isRTO ? 0 : item.quantity.count);

    if (!isCancelFulfillment) {
      totalPrice += itemPrice;
    }

    breakup.push({
      "@ondc/org/item_id": item.id,
      "@ondc/org/item_quantity": {
        count: isCancelFulfillment || isRTO ? 0 : item.quantity.count,
      },
      title: initialItemsData.descriptor.name,
      "@ondc/org/title_type": "item",
      price: {
        currency: "INR",
        value: itemPrice.toString(),
      },
      item: {
        parent_item_id: item.parent_item_id,
        quantity: {
          available: {
            count: initialItemsData.quantity.available.count,
          },
          maximum: {
            count: initialItemsData.quantity.maximum.count,
          },
        },
        price: {
          currency: "INR",
          value: initialItemsData.price.value,
        },
        tags: item.tags,
      },
    });

    const taxPrice = (itemPrice * 0.05).toFixed(2).toString();

    totalPrice += parseInt(taxPrice);

    breakup.push({
      "@ondc/org/item_id": item.id,
      title: "Tax",
      "@ondc/org/title_type": "tax",
      price: {
        currency: "INR",
        value: taxPrice,
      },
      item: {
        parent_item_id: item.parent_item_id,
        tags: item.tags,
      },
    });
  });

  let deliveryBreakup: any[] = [];

  fulfillments.forEach((fulfillment: any) => {
    if (fulfillment.type === "Delivery") {
      totalPrice += 75;
      deliveryBreakup = [
        ...deliveryBreakup,
        {
          "@ondc/org/item_id": fulfillment.id,
          title: "Delivery charges",
          "@ondc/org/title_type": "delivery",
          price: {
            currency: "INR",
            value: "50.00",
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
    } else if (fulfillment.type === "Buyer-Delivery") {
      totalPrice += 85;
      deliveryBreakup = [
        ...deliveryBreakup,
        {
          "@ondc/org/item_id": fulfillment.id,
          title: "Delivery charges",
          "@ondc/org/title_type": "delivery",
          price: {
            currency: "INR",
            value: "60.00",
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

  offersData?.offers?.forEach((offer: any) => {
    offersData?.initalOffers?.forEach((initOffer: any) => {
      if (initOffer.id === offer.id) {
        const conditions = extractTags(initOffer.tags);

        console.log(
          "::::::::::::::::",
          parseInt(conditions?.qualifier?.min_value) < totalPrice,
          parseInt(conditions?.qualifier?.min_value),
          totalPrice
        );
        if (parseInt(conditions?.qualifier?.min_value) > totalPrice) {
          return;
        }

        const benifitType = conditions?.benefit?.value_type;

        let price = "";

        if (benifitType === "amount") {
          price = conditions?.benefit?.value;

          totalPrice -= parseInt(conditions?.benefit?.valu || "0");
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
          title: offer.id,
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

  breakup = [...breakup, ...deliveryBreakup];

  quote.price = {
    currency: "INR",
    value: totalPrice.toString(),
  };

  quote.breakup = breakup;

  return quote;
};
