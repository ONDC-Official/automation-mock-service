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
      parseInt(item.price.value) !== 0 &&
      (!parentItemId || item?.item?.parent_item_id === parentItemId)
    ) {
      console.log("items:", items);
      console.log("item{asdas", item["@ondc/org/item_id"]);

      const tags = items.find(
        (allItem: any) => allItem.id === item["@ondc/org/item_id"]
      ).tags;
      const subType = extractType(tags);

      quoteTrailTags.push({
        code: "quote_trail",
        list: [
          {
            code: "type",
            value: item["@ondc/org/title_type"],
          },
          ...(subType
            ? [
                {
                  code: "subtype",
                  value: subType,
                },
              ]
            : []),

          {
            code: "parent_item_id",
            value: item.item.parent_item_id,
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