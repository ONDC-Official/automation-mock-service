import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import { createFulfillments } from "../../api-objects/fulfillments";
import { SelectedItems } from "../../on_select/on_select/generator";

export async function init_self_pickup_generator(
    existingPayload: any,
    sessionData: SessionData
) {
    const items = sessionData.selected_items as SelectedItems;
    const onSelectFulfillments = sessionData.on_select_fulfillments
    const selfPickupFulfillment = [onSelectFulfillments.find((f:any) => f.type === "Self-Pickup")];
    const selected = sessionData.selected_fulfillments
    const defaultEnd = {
        end: {
            contact: {
                email: "nobody@nomail.com",
                phone: "9898989898",
            },
        },
    };
    const initFulfillments = selfPickupFulfillment.map((f:any) => {
        return {
            id: f.id,
            type: f.type,
            end: defaultEnd.end,
        };
    });
    existingPayload.message.order.fulfillments = initFulfillments

    existingPayload.message.order.items = items.map((item) => {
        return {
            id: item.id,
            fulfillment_id: selfPickupFulfillment[0].id,
            quantity: {
                count: item.quantity.count,
            },
            location_id: item.location_id,
        };
    });
    existingPayload.message.order.billing = getUpdatedBilling(
        existingPayload.message.order.billing,
        true
    );
    return existingPayload;
}
2