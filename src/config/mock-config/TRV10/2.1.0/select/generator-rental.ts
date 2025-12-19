import { add } from "winston";
import { SessionData } from "../../session-types";

function getRandomItemWithAddon(items: any[]) {
  if (items.length === 0) return { items: [] };

  const randomItem = items[Math.floor(Math.random() * items.length)];

  if (!randomItem.add_ons || randomItem.add_ons.length === 0) {
    return { items: [{ id: randomItem.id, add_ons: [] }] };
  }

  const randomAddon =
    randomItem.add_ons[Math.floor(Math.random() * randomItem.add_ons.length)];

  const minCount = randomAddon.quantity.minimum.count;
  const maxCount = randomAddon.quantity.maximum.count;

  const selectedQuantity =
    Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;

  return {
    items: [
      {
        id: randomItem.id,
        add_ons: [
          {
            id: randomAddon.id,
            quantity: {
              selected: {
                count: selectedQuantity,
              },
            },
          },
        ],
      },
    ],
  };
}

export async function selectMultipleStopsRentalGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  // const result = getRandomItemWithAddon(sessionData.items);
  // existingPayload.message.order.items = result.items

  const items = sessionData.items || [];
  const randomItem = items[Math.floor(Math.random() * items.length)];
  if (sessionData.user_inputs?.items?.length > 0) {
    const addOns = sessionData.user_inputs?.items
      ?.filter((item: any) => item.count > 0)
      .map((item: any) => {
        return {
          id: item.addOns,
          quantity: {
            selected: {
              count: item.count,
            },
          },
        };
      });
    const updatedItem: any = {
      id: randomItem.id,
    };

    if (addOns.length > 0) {
      updatedItem.add_ons = addOns;
    }

    existingPayload.message.order.items[0] = updatedItem;
  }
  return existingPayload;
}
