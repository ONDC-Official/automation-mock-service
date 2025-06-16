import { SessionData } from "../../session-types";

const createQuoteFromItems = (items: any): any => {
    let totalPrice = 0;

    const breakup = items.map((item: any) => {
        const itemPrice = Number(item.price.value);
        totalPrice += itemPrice;

        return {
            title: "BASE_FARE",
            price: {
                currency: item.price.currency,
                value: itemPrice.toFixed(2)
            }
        };
    });

    // Add distance fare if present
    if (items[0]?.tags) {
        const farePolicy = items[0].tags.find((tag: any) => tag.descriptor.code === "FARE_POLICY");
        if (farePolicy) {
            const perKmCharge = farePolicy.list.find((item: any) => item.descriptor.code === "PER_KM_CHARGE");
            if (perKmCharge) {
                const distanceFare = {
                    title: "DISTANCE_FARE",
                    price: {
                        currency: items[0].price.currency,
                        value: (Number(items[0].price.value) - Number(farePolicy.list.find((item: any) => 
                            item.descriptor.code === "MIN_FARE").value)).toFixed(2)
                    }
                };
                breakup.push(distanceFare);
            }
        }
    }

    return {
        price: {
            value: totalPrice.toFixed(2),
            currency: items[0]?.price.currency || "INR"
        },
        breakup,
        ttl: "PT200S"
    };
};

function getUniqueFulfillmentIdsAndFilterFulfillments(
    items: any[],
    fulfillments: any[]
): any[] {
    if (!Array.isArray(fulfillments)) {
        fulfillments = fulfillments ? [fulfillments] : [];
    }
    const fulfillmentIds = items
        .flatMap((item) => item.fulfillment_ids)
        .filter((value, index, self) => self.indexOf(value) === index);

    return fulfillments.filter(
        (fulfillment) => fulfillmentIds.includes(fulfillment.id)
    );
}

const filterItemsBySelectedIds = (
    items: any[],
    selectedIds: string | string[]
): any[] => {
    const idsToFilter = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
    return items.filter((item) => idsToFilter.includes(item.id));
};

export async function onSelectGenerator(
    existingPayload: any,
    sessionData: SessionData
) {
    let items = filterItemsBySelectedIds(
        sessionData.items,
        sessionData.selected_item_id
    );
    
    let fulfillments = getUniqueFulfillmentIdsAndFilterFulfillments(
        items,
        sessionData.fulfillments
    );

    const quote = createQuoteFromItems(items);

    existingPayload.message.order.items = items;
    existingPayload.message.order.fulfillments = fulfillments;
    existingPayload.message.order.quote = quote;

    return existingPayload;
}