import { SessionData } from "../../session-types";
function getRandomItemWithAddon(items: any[]) {
    if (items.length === 0) return { items: [] };

    // Select a random item
    const randomItem = items[Math.floor(Math.random() * items.length)];

    // If no add-ons, return just the item
    if (!randomItem.add_ons || randomItem.add_ons.length === 0) {
        return { items: [{ id: randomItem.id, add_ons: [] }] };
    }

    // Select a random add-on
    const randomAddon = randomItem.add_ons[Math.floor(Math.random() * randomItem.add_ons.length)];

    // Extract min and max count
    const minCount = randomAddon.quantity.minimum.count;
    const maxCount = randomAddon.quantity.maximum.count;

    // Select a random quantity within range
    const selectedQuantity = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;

    // Return the formatted output
    return {
        items: [
            {
                id: randomItem.id,
                add_ons: [
                    {
                        id: randomAddon.id,
                        quantity: {
                            selected: {
                                count: selectedQuantity
                            }
                        }
                    }
                ]
            }
        ]
    };
}
  
export async function selectMultipleStopsRentalGenerator(existingPayload: any, sessionData: SessionData) {
    const result = getRandomItemWithAddon(sessionData.items);
    existingPayload.message.order.items = result.items
    return existingPayload;
}