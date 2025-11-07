import { SessionData, Input } from "../../../session-types";
import { stateCodes } from "../areaCodes";
import { on_search_items } from "../data";

type TagEntry = {
  code: string;
  value: string;
};

type Tag = {
  code: string;
  list: TagEntry[];
};

type Item = {
  id: string;
  tags?: Tag[];
};

function getParentIdValue(items: Item[], id: string): string | null {
  const item = items.find((i) => i.id === id);
  if (!item) return null;

  const parentTag = item.tags?.find((tag) => tag.code === "parent");
  if (!parentTag) return null;

  const idEntry = parentTag.list.find((entry) => entry.code === "id");
  return idEntry?.value || null;
}

export const selectGenerator = (
  existingPayload: any,
  sessionData: SessionData,
  inputs?: Input
) => {
  if (inputs?.providerId) {
    existingPayload.message.order.provider.id = inputs.providerId;
  }

  if (inputs?.locationId) {
    existingPayload.message.order.provider.locations[0] = {
      id: inputs.locationId,
    };
  }

  if (inputs?.items) {
    let newItems: any = [];
    let allItems = inputs.items;

    allItems.forEach((item: any, index: number) => {
      const parentItemId = `P${index}`;
      newItems.push({
        id: item.id,
        parent_item_id: parentItemId,
        location_id: inputs.locationId,
        quantity: { count: 1 },
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
      });

      item?.customisations?.forEach((customisation: any) => {
        newItems.push({
          id: customisation,
          parent_item_id: parentItemId,
          location_id: inputs.locationId,
          quantity: { count: 1 },
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
                  value: item.relation[customisation],
                },
              ],
            },
          ],
        });
      });
    });

    existingPayload.message.order.items = newItems;
  }

  if (inputs?.gps && inputs?.area_code) {
    existingPayload.message.order.fulfillments[0] = {
      end: {
        location: {
          gps: inputs.gps,
          address: {
            area_code: inputs.area_code,
          },
        },
      },
    };

    existingPayload.context.city =
      `std:${stateCodes[inputs?.area_code]}` || "std:011";
  }

  if (inputs?.options) {
    if (inputs.options.includes("demandSignal")) {
      existingPayload.message.order.tags = [
        {
          code: "bnp_demand_signal",
          list: [
            {
              code: "source",
              value: "digihaat.com",
            },
            {
              code: "campaign",
              value: "RD76_sale",
            },
          ],
        },
      ];
    }
  }

  if (inputs?.offerId) {
    existingPayload.message.order.offers = [
      {
        id: inputs.offerId,
      },
    ];
  }

  return existingPayload;
};
