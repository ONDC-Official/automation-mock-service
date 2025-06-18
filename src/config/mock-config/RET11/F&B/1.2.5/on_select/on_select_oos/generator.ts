import { SessionData, Input } from "../../../../session-types";
import { on_search_items } from "../../data";

type TagEntry = {
	code: string;
	value: string;
};

type Tag = {
	code: string;
	list: TagEntry[];
};

function getTagType(tags: Tag[]): string | undefined {
	const typeTag = tags.find((tag) => tag.code === "type");

	if (!typeTag) return undefined;

	const typeEntry = typeTag.list.find((entry) => entry.code === "type");

	return typeEntry?.value;
}

export const onSelectOOSGenerator = (
	existingPayload: any,
	sessionData: SessionData,
	inputs?: Input
) => {
	if (sessionData?.provider) {
		existingPayload.message.order.provider = sessionData.provider;
	}

	let oosItmParentItemId = sessionData?.items?.find(
		(item) => item.id === inputs?.oosItem
	).parent_item_id;

	if (sessionData?.items && sessionData?.select_fulfillment?.length) {
		existingPayload.message.order.items = sessionData.items.map((item: any) => {
			return {
				...item,
				quantity: {
					count:
						item.parent_item_id === oosItmParentItemId
							? 0
							: item.quantity.count,
				},
				fulfillment_id: existingPayload.message.order.fulfillments?.find(
					(fulfillment: any) => fulfillment.type === "Delivery"
				)?.id,
			};
		});
	}

	let breakup: any = [];
	let totalPrice = 0;

	sessionData.items.forEach((item: any) => {
		const initialItemsData: any = on_search_items?.filter(
			(on_search_item) => on_search_item.id === item.id
		)[0];

		totalPrice += parseFloat(initialItemsData.price.value);

		console.log("iinitalalsd", initialItemsData);

		let isOOSItem = false;

		if (inputs?.oosItem === item.id) {
			isOOSItem = true;
		}

		breakup.push({
			"@ondc/org/item_id": item.id,
			"@ondc/org/item_quantity": {
				count: isOOSItem ? 0 : 1,
			},
			title: initialItemsData.descriptor.name,
			"@ondc/org/title_type": "item",
			price: {
				currency: "INR",
				value: isOOSItem ? "0" : initialItemsData.price.value, 
			},
			item: {
				parent_item_id: item.parent_item_id,
				quantity: {
					available: {
						count: isOOSItem ? "0" : initialItemsData.quantity.available.count,
					},
					maximum: {
						count: isOOSItem ? "0" : initialItemsData.quantity.maximum.count,
					},
				},
				price: {
					currency: "INR",
					value: initialItemsData.price.value, /// ?????????
				},
				tags: item.tags,
			},
		});

		const type = getTagType(item.tags);
		const taxPrice = type === "item" ? "12.00" : "0.00";

		if (!isOOSItem) {
			totalPrice += parseInt(taxPrice);

			breakup.push({
				"@ondc/org/item_id": item.id,
				title: "Tax",
				"@ondc/org/title_type": "tax",
				price: {
					currency: "INR",
					value: taxPrice,
				},
				item: {
					parent_item_id: item.parent_item_id,
					tags: item.tags,
				},
			});
		}
	});

	const deliveryBreakup = [
		{
			"@ondc/org/item_id": "F1",
			title: "Delivery charges",
			"@ondc/org/title_type": "delivery",
			price: {
				currency: "INR",
				value: "50.00",
			},
		},
		{
			"@ondc/org/item_id": "F1",
			title: "Packing charges",
			"@ondc/org/title_type": "packing",
			price: {
				currency: "INR",
				value: "25.00",
			},
		},
	];

	breakup = [...breakup, ...deliveryBreakup];

	totalPrice += 75;

	existingPayload.message.order.quote.price = {
		currency: "INR",
		value: totalPrice.toString(),
	};

	existingPayload.message.order.quote.breakup = breakup;

	const errorMsg = [
		{
			dynamic_item_id: oosItmParentItemId,
			item_id: inputs?.oosItem,
			error: "400002",
		},
	];

	existingPayload.error = {
		type: "DOMAIN-ERROR",
		code: "40002",
		message: JSON.stringify(errorMsg),
	};

	return existingPayload;
};
