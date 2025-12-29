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
  const userItems = sessionData.user_inputs?.items || [];

  if (!userItems.length) {
    return existingPayload;
  }

  const orderItems = userItems.map((userItem: any) => {
    const updatedItem: any = {
      id: userItem.itemId,
    };

    if (Array.isArray(userItem.addOns) && userItem.addOns.length > 0) {
      updatedItem.add_ons = userItem.addOns.map((addon: any) => ({
        id: addon.id,
        quantity: {
          selected: {
            count: addon.quantity,
          },
        },
      }));
    }

    return updatedItem;
  });

  existingPayload.message.order.items = orderItems;
  return existingPayload;
}
