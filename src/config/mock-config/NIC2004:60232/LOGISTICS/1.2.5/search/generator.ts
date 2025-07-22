import {
  getFutureDate,
  TatMapping,
  getFutureDateInMinutes,
} from "../../../../../../utils/generic-utils";
import { SessionData, Input } from "../../../session-types";

export async function searchGenerator(
  existingPayload: any,
  sessionData: SessionData,
  inputs: Input | undefined
) {
  console.log("inside search generator");

  existingPayload.message.intent.provider.time.schedule.holidays = [
    getFutureDate(10),
    getFutureDate(15),
  ];

  if (inputs?.feature_discovery || inputs?.default_feature) {
    let codesArray = inputs.feature_discovery || [];
    console.log(inputs?.default_feature);

    if (inputs?.default_feature) {
      const defaults = Array.isArray(inputs.default_feature)
        ? inputs.default_feature
        : [inputs.default_feature]; // just in case it's not an array

      codesArray = Array.from(new Set([...codesArray, ...defaults]));
    }

    console.log(codesArray);
    existingPayload.message.intent.tags = [
      {
        code: "lbnp_features",
        list: [
          { code: "005", value: "yes" },
          { code: "006", value: "yes" },
          { code: "007", value: "yes" },
        ],
      },
    ];

    existingPayload.message.intent.tags =
      existingPayload.message.intent.tags.map((tag: any) => {
        if (tag.code === "lbnp_features") {
          const newTags = codesArray.map((code) => {
            return {
              code: code,
              value: "yes",
            };
          });

          tag.list = newTags;
        }

        return tag;
      });
  } else {
    delete existingPayload.message.intent.tags;
  }

  if (inputs?.category) {
    console.log("inside prep time");

    existingPayload.message.intent.provider.time.duration =
      TatMapping[inputs?.category].orderPrepTime;
  }

  if (inputs?.fulfillRequest) {
    const tag = {
      code: "fulfill_request",
      list: [
        ...(inputs.fulfillRequest === "Rider"
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
        {
          code: "motorable_distance",
          value: "3.0",
        },
        {
          code: "pickup_slot_start",
          value: getFutureDateInMinutes(10),
        },
        {
          code: "pickup_slot_end",
          value: getFutureDateInMinutes(12),
        },
        {
          code: "delivery_slot_start",
          value: getFutureDateInMinutes(20),
        },
        {
          code: "delivery_slot_end",
          value: getFutureDateInMinutes(30),
        },
      ],
    };

    existingPayload.message.intent.fulfillment.tags.push(tag);
  }
  if (inputs?.feature_discovery && inputs?.feature_discovery?.includes("009")) {
    existingPayload.message.intent.fulfillment.start.instructions = {
      code: "5",
    };
    existingPayload.message.intent.fulfillment.end.instructions = {
      code: "5",
    };
  }
  existingPayload.message.intent.fulfillment.tags =
    existingPayload.message.intent.fulfillment.tags.map((tag: any) => {
      if (tag.code === "linked_order") {
        const newList = tag.list.map((item: any) => {
          if (item.code === "category") {
            return {
              code: item.code,
              value: inputs?.retailCategory || "Grocery",
            };
          }
          return item;
        });

        return {
          code: tag.code,
          list: newList,
        };
      }

      return tag;
    });

  existingPayload.message.intent["@ondc/org/payload_details"].category =
    inputs?.retailCategory || "Grocery";

  return existingPayload;
}
