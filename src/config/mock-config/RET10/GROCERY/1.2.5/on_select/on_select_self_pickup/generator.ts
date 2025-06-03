import { SessionData } from "../../../../session-types";
import { createQuote } from "../../api-objects/breakup";
import { RET10GROCERY125Catalog } from "../../on_search/catalog";

export type SelectedItems = {
    id: string;
    quantity: {
        count: number;
    };
    location_id: string;
}[];
const fulfillment_breakup = [
    {
        "@ondc/org/item_id": "F2",
        title: "Delivery charges",
        "@ondc/org/title_type": "delivery",
        price: {
            currency: "INR",
            value: "00.00",
        },
    },
    {
        "@ondc/org/item_id": "F2",
        title: "Convenience Fee",
        "@ondc/org/title_type": "misc",
        price: {
            currency: "INR",
            value: "00.00",
        },
    }
]
export const breakupItem = {
    "@ondc/org/item_id": "I1",
    "@ondc/org/item_quantity": {
        count: 1,
    },
    title: "Plain Atta",
    "@ondc/org/title_type": "item",
    price: {
        currency: "INR",
        value: "100.00",
    },
    item: {
        quantity: {
            available: {
                count: "99",
            },
            maximum: {
                count: "99",
            },
        },
        price: {
            currency: "INR",
            value: "100.00",
        },
    },
};

export const breakup = [
    {
        "@ondc/org/item_id": "F1",
        title: "Delivery charges",
        "@ondc/org/title_type": "delivery",
        price: {
            currency: "INR",
            value: "00.00",
        },
    },
    {
        "@ondc/org/item_id": "F1",
        title: "Convenience Fee",
        "@ondc/org/title_type": "misc",
        price: {
            currency: "INR",
            value: "00.00",
        },
    },
];

export async function on_select_self_pickup_generator(
    existingPayload: any,
    sessionData: SessionData
) {
    const selectedItemsObj = sessionData.selected_items as SelectedItems;
    console.log("Selected Items: ", selectedItemsObj);
    const catalog = RET10GROCERY125Catalog;
    existingPayload.message.order.items = selectedItemsObj.map((item) => {
        return {
            id: item.id,
            fulfillment_id: "F1",
        };
    });
    const catalogItems = catalog.catalog["bpp/providers"][0].items.filter((i:any) => {
        console.log("Catalog Item: ", i.id);
        const idMap = selectedItemsObj.map((item) => item.id);
        console.log("ID Map: ", idMap);
        return idMap.includes(i.id);
    });
    console.log("Catalog Items: ", catalogItems);
    const quote = createQuote(
        selectedItemsObj.map((item) => {
            return {
                id: item.id,
                count: item.quantity.count,
            };
        }),
        sessionData,
        existingPayload
    );
    for (let i = 0; i < fulfillment_breakup.length; i++) {
        quote.breakup.push(fulfillment_breakup[i]);
    }
    existingPayload.message.order.quote = quote;
    return existingPayload;
}
