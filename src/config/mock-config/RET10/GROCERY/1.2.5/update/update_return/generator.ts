import { SessionData } from "../../../../session-types";
import { getRandomItem } from "../../on_select/on_select_out_of_stock/generator";
import { v4 as uuid } from "uuid";
export async function update_return(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload.message.order.id = sessionData.order_id;
	const items = sessionData.items;
	const itemIds = items.map((item: any) => item.id);
	const id = getRandomItem(itemIds);
	const tags = existingPayload.message.order.fulfillments[0].tags;
	tags[0].list[0].value = uuid();
	tags[0].list[1].value = id;
	return existingPayload;
}
