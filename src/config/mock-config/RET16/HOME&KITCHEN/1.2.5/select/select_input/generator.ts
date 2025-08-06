import { SessionData } from "../../../../session-types";
import { stateCodes } from "../state-codes";

type SelectInputType = {
  provider?: string;
  provider_location?: string[];
  location_gps?: string;
  location_pin_code?: string;
  items?: {
    itemId?: string;
    quantity?: number;
    location?: string;
  }[];
  [key: string]: any;
};

export async function select_input_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  const inputs = sessionData.user_inputs as SelectInputType;
  if (!inputs) return existingPayload;

  console.log("inputs", JSON.stringify(inputs));

  if (inputs.provider) {
    existingPayload.message.order.provider.id = inputs.provider;
  }
  if (inputs.provider_location) {
    existingPayload.message.order.provider.locations =
      inputs.provider_location.map((location) => {
        return {
          id: location,
        };
      });
  }
  if (inputs.location_gps) {
    existingPayload.message.order.fulfillments[0].end.location.gps =
      inputs.location_gps;
  }
  if (inputs.location_pin_code) {
    existingPayload.message.order.fulfillments[0].end.location.address.area_code =
      inputs.location_pin_code;
    existingPayload.context.city = `std:${
      stateCodes[inputs.location_pin_code as keyof typeof stateCodes] ?? "080"
    }`;
  }
  if (inputs.items) {
    existingPayload.message.order.items = inputs.items.map((item: any) => {
      return {
        id: item.itemId,
        quantity: {
          count: item.quantity,
        },
        location_id: item.location,
      };
    });
  }
  const parentItemId = "D1";
  let customInput = "Be careful with the delivery of the item";
  let customizedItem = existingPayload.message.order.items[0];
  customizedItem = {
    ...customizedItem,
    parent_item_id: parentItemId,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "item",
          },
        ],
      },
    ],
  };
  let customization = {
    id: "C1",
    quantity: {
      count: 1,
    },
    parent_item_id: parentItemId,
    descriptor: {
      tags: [
        {
          code: "customization",
          list: [
            {
              code: "input_text",
              value: customInput,
            },
          ],
        },
      ],
    },
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG1",
          },
        ],
      },
    ],
  };
  existingPayload.message.order.items[0] = customizedItem;
  existingPayload.message.order.items.push(customization);

  return existingPayload;
}
