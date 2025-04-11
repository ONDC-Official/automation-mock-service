import { SessionData, Input } from "../../../session-types";

const TatMapping: any = {
  "Immediate Delivery": { code: "PT60M", day: 0, pickupTime: "PT15M" },
  "Same Day Delivery": { code: "PT4H", day: 0, pickupTime: "PT1H" },
  "Next Day Delivery": { code: "P1D", day: 1, pickupTime: "PT4H" },
  "Standard Delivery": { code: "P2D", day: 2, pickupTime: "PT12H" },
  "Express Delivery": { code: "P3D", day: 2, pickupTime: "P1D" },
  "Instant Delivery": { code: "PT10M", day: 0, pickupTime: "PT2M" },
};

function getDateFromToday(days: number) {
  const today = new Date();
  today.setDate(today.getDate() + days);
  return today.toISOString().split("T")[0];
}

export async function onSearch1Generator(
  existingPayload: any,
  sessionData: SessionData,
  inputs?: Input
) {
  existingPayload.message.catalog["bpp/descriptor"].tags[0].list =
    existingPayload.message.catalog["bpp/descriptor"].tags[0].list.map(
      (item: any) => {
        if (item.code === "effective_date") {
          return {
            code: item.code,
            value: existingPayload.context.timestamp,
          };
        }

        return item;
      }
    );

  const categoriesData = {
    id: sessionData.category_id,
    time: {
      label: "TAT",
      duration: TatMapping[sessionData?.category_id as string].code,
      timestamp: getDateFromToday(
        TatMapping[sessionData?.category_id as string].day
      ),
    },
  };
  existingPayload.message.catalog["bpp/providers"][0].categories[0] =
    categoriesData;

  let isFulfillRequest = false;

  sessionData?.fulfillment?.tags?.map((tag: any) => {
    if (tag.code === "fulfill_request") {
      isFulfillRequest = true;
    }
  });

  if (isFulfillRequest) {
    existingPayload.message.catalog["bpp/providers"][0].items.push({
      id: "I3",
      parent_item_id: "",
      category_id: "Instant Delivery",
      fulfillment_id: "1",
      descriptor: {
        name: "Fast delivery",
        short_desc: "Fast delivery services",
        long_desc: "Fast delivery services",
      },
      price: {
        currency: "INR",
        value: "88.50",
      },
      time: {
        label: "TAT",
        duration: "PT10M",
        timestamp: "2024-11-20",
      },
      tags: [
        {
          code: "type",
          list: [
            {
              code: "type",
              value: sessionData?.rate_basis,
            },
            ...(sessionData?.rate_basis === "rider"
              ? [
                  {
                    code: "unit",
                    value: "hour",
                  },
                ]
              : []),
          ],
        },
      ],
    });
  }

  existingPayload.message.catalog["bpp/providers"][0].items =
    existingPayload.message.catalog["bpp/providers"][0].items.map(
      (item: any) => {
        item.time = {
          label: "TAT",
          duration: TatMapping[sessionData.category_id as string].code,
          timestamp: getDateFromToday(
            TatMapping[sessionData.category_id as string].day
          ),
        };

        return item;
      }
    );

  existingPayload.message.catalog["bpp/providers"][0].items =
    existingPayload.message.catalog["bpp/providers"][0].items.map(
      (item: any) => {
        item.category_id = sessionData?.category_id;

        if (isFulfillRequest && item.id === "I1") {
          item.tags = [
            {
              code: "type",
              list: [
                {
                  code: "type",
                  value: "base",
                },
              ],
            },
          ];
        }

        return item;
      }
    );

  existingPayload.message.catalog["bpp/providers"][0].fulfillments =
    existingPayload.message.catalog["bpp/providers"][0].fulfillments.map(
      (fulfillment: any) => {
        if (fulfillment.type === "Delivery") {
          if (isFulfillRequest) {
            fulfillment.tags = [
              ...fulfillment.tags,
              {
                code: "fulfill_response",
                list: [
                  ...(sessionData?.rate_basis === "rider"
                    ? [
                        {
                          code: "rider_count",
                          value: "2",
                        },
                        {
                          code: "rate_basis",
                          value: "rider",
                        },
                      ]
                    : [
                        {
                          code: "order_count",
                          value: "10",
                        },
                        {
                          code: "rate_basis",
                          value: "order",
                        },
                      ]),
                ],
              },
              ...sessionData?.fulfillment.tags
                .map((tag: any) => {
                  if (
                    tag.code === "fulfill_request" ||
                    tag.code === "linked_provider"
                  ) {
                    return tag;
                  }
                })
                .filter((item: any) => item),
            ];
          }
          fulfillment.start.time.duration =
            TatMapping[sessionData.category_id as string].pickupTime;
        }

        return fulfillment;
      }
    );

  if (sessionData?.is_cod === "yes") {
    existingPayload.message.catalog["bpp/providers"][0].items[0].tags = [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "base",
          },
        ],
      },
    ];
  }

  if (sessionData?.is_cod === "yes") {
    existingPayload.message.catalog["bpp/providers"][0].items.push({
      id: "C1",
      parent_item_id: "",
      category_id: sessionData?.category_id,
      fulfillment_id: "1",
      descriptor: {
        name: "COD Fee",
        short_desc: "COD Fee",
        long_desc: "Cash on delivery fee",
      },
      price: {
        currency: "INR",
        value: "11.00",
      },
      tags: [
        {
          code: "type",
          list: [
            {
              code: "type",
              value: "cod",
            },
          ],
        },
      ],
    });

    existingPayload.message.catalog["bpp/providers"][0].tags = [
      {
        code: "special_req",
        list: [
          {
            code: "cod_order",
            value: "yes",
          },
        ],
      },
    ];
  }

  if (inputs?.feature_discovery) {
    let codesArray = inputs.feature_discovery;

    existingPayload.message.catalog.tags = [
      {
        code: "lsp_features",
        list: [
          { code: "005", value: "yes" },
          { code: "009", value: "yes" },
          { code: "00C", value: "yes" },
        ],
      },
    ];

    existingPayload.message.catalog.tags =
      existingPayload.message.catalog.tags.map((tag: any) => {
        if (tag.code === "lsp_features") {
          const newTags = codesArray.map((code) => {
            return {
              code: code,
              value: "yes",
            };
          });

          tag.list = newTags;

          if (sessionData.payment_type === "ON-ORDER") {
            tag.list = [
              ...tag.list,
              {
                code: "00D",
                value: "yes",
              },
            ];
          }
        }

        return tag;
      });
  }

  return existingPayload;
}
