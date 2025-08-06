import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import {
  createFulfillments,
  Fulfillments,
} from "../../api-objects/fulfillments";
import { SelectedItems } from "../../on_select/on_select/generator";

export async function init_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  const items = sessionData.selected_items as any;
  const onSelectData = sessionData.on_select_fulfillments as Fulfillments;
  const fId = onSelectData.find((f) => f.type === "Delivery")?.id || "F1";

  existingPayload.message.order.items = items.map((item: any) => {
    const newItem: any = {
      quantity: item.quantity,
      id: item.id,
      fulfillment_id: fId || "F1",
    };

    if (item.parent_item_id && item.tags) {
      newItem.parent_item_id = item.parent_item_id;
      newItem.tags = item.tags;
    }

    return newItem;
  });
  existingPayload.message.order.billing = getUpdatedBilling(
    existingPayload.message.order.billing,
    true
  );
  existingPayload.message.order.fulfillments = createFulfillments(
    "init",
    "init",
    sessionData,
    existingPayload.message.order.fulfillments
  );
  existingPayload.message.order.provider = sessionData.provider;
  return existingPayload;
}
