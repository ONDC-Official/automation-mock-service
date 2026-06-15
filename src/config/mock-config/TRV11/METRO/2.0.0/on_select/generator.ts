import { updateProviderTime } from "../../../../../../utils/generic-utils";
import { SessionData } from "../../../session-types";

const createQuoteFromItems = (items: any): any => {
	if (!Array.isArray(items) || items.length === 0) {
		return {
			price: {
				value: "0.00",
				currency: "INR",
			},
			breakup: [],
		};
	}
	let totalPrice = 0; // Initialize total price

	const breakup = items.map((item: any) => {
		const selectedCount = item?.quantity?.selected?.count ?? 0;
		const itemPrice = Number(item?.price?.value ?? 0);
		const itemTotalPrice = itemPrice * selectedCount; // Calculate item total price
		totalPrice += itemTotalPrice; // Add to total price

		return {
			title: "BASE_FARE",
			item: {
				id: item.id,
				price: {
					currency: item?.price?.currency || "INR",
					value: itemPrice.toFixed(2),
				},
				quantity: {
					selected: {
						count: selectedCount,
					},
				},
			},
			price: {
				currency: item?.price?.currency || "INR",
				value: itemTotalPrice.toFixed(2),
			},
		};
	});

	return {
		price: {
			value: totalPrice.toFixed(2), // Total price as a string with two decimal places
			currency: items[0]?.price?.currency || "INR", // Use currency from the first item or default to "INR"
		},
		breakup,
	};
};

function createAndAppendFulfillments(items: any[], fulfillments: any[]): void {
	if (!Array.isArray(items) || !Array.isArray(fulfillments)) {
		return;
	}
	items.forEach((item) => {
		if (item && Array.isArray(item.fulfillment_ids)) {
			const idsToProcess = [...item.fulfillment_ids];
			idsToProcess.forEach((parentFulfillmentId: string) => {
				// Get the parent fulfillment object from the fulfillments array
				const parentFulfillment = fulfillments.find(
					(f) => f && f.id === parentFulfillmentId
				);

				if (parentFulfillment) {
					// Get the quantity based on the selected count
					const quantity = item.quantity?.selected?.count ?? 0;

					for (let i = 0; i < quantity; i++) {
						// Create a deep copy of the parent fulfillment
						const newFulfillment = {
							...structuredClone(parentFulfillment), // Deep copy to avoid mutations
							id: `F${Math.random().toString(36).substring(2, 9)}`, // Unique ID for new fulfillment
						};

						// Append the new fulfillment to the fulfillments array
						fulfillments.push(newFulfillment);

						// Append the new fulfillment's id to the item's fulfillment_ids
						item.fulfillment_ids.push(newFulfillment.id);
					}
				}
			});
			item.fulfillment_ids.shift();
		}
	});
	if (fulfillments.length > 0) {
		fulfillments.shift();
	}
}


function getUniqueFulfillmentIdsAndFilterFulfillments(
    items: any[],
    fulfillments: any[]
): any[] {
	if (!Array.isArray(items)) {
		return [];
	}
	if (!Array.isArray(fulfillments)) {
		fulfillments = fulfillments ? [fulfillments] : [];
	}
	// Step 1: Get all unique fulfillment IDs from the items
	const fulfillmentIds = items
		.flatMap((item) => item?.fulfillment_ids || []) // Flatten the fulfillment_ids arrays
		.filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
	// Step 2: Filter the fulfillments based on the unique fulfillment IDs
	const filteredFulfillments = fulfillments.filter(
		(fulfillment) => fulfillment && fulfillmentIds.includes(fulfillment.id) // Check if fulfillment.id is in the unique fulfillmentIds list
	);
	return filteredFulfillments;
}

const filterItemsBySelectedIds = (
    items: any[],
    selectedIds: string | string[]
): any[] => {
	if (!Array.isArray(items)) {
		return [];
	}
	// Convert selectedIds to an array if it's a string
	const idsToFilter = Array.isArray(selectedIds) ? selectedIds : (selectedIds ? [selectedIds] : []);

	// Filter the items array based on the presence of ids in selectedIds
	return items.filter((item) => item && idsToFilter.includes(item.id));
};

export async function onSelectGenerator(
    existingPayload: any,
    sessionData: SessionData
) {
	// Detect Monthly Pass flow
	const isPassFlow = sessionData.flowId === "ORDER_TO_CONFIRM_MONTHLY_PASS";
	
	if (isPassFlow) {
		const sessionItems = Array.isArray(sessionData.items) ? sessionData.items : [];
		const passItem = sessionItems.find((item: any) => item.id === "I3");
		if (passItem) {
			const passItemWithQuantity = {
				...passItem,
				quantity: { selected: { count: 1 } }
			};
			
			// Get F1 fulfillment for Pass (same as SJT)
			const sessionFulfillments = Array.isArray(sessionData.fulfillments) ? sessionData.fulfillments : [];
			const passFulfillment = sessionFulfillments.find((f: any) => f.id === "F1");
			const fulfillments = passFulfillment ? [{ ...passFulfillment }] : [];
			
			const quote = createQuoteFromItems([passItemWithQuantity]);
			
			existingPayload.message.order.items = [passItemWithQuantity];
			existingPayload.message.order.fulfillments = fulfillments;
			existingPayload.message.order.quote = quote;
			return existingPayload;
		}
	}
	
	// Standard SJT/RJT flow logic
	let items = filterItemsBySelectedIds(
		sessionData.items,
		sessionData.selected_item_ids
	);
	let fulfillments = getUniqueFulfillmentIdsAndFilterFulfillments(
		sessionData.items,
		sessionData.fulfillments
	);
	
	const selectedItems = Array.isArray(sessionData.selected_items) ? sessionData.selected_items : [];
	const ids_with_quantities = {
		items: selectedItems.reduce((acc: any, item: any) => {
			if (item && item.id && item.quantity?.selected?.count !== undefined) {
				acc[item.id] = item.quantity.selected.count;
			}
			return acc;
		}, {}),
	};
	
	const sessionItems = Array.isArray(sessionData.items) ? sessionData.items : [];
	const updatedItems = sessionItems
    .map((item: any) => ({
        ...item,
        quantity: {
            selected: {
                count: ids_with_quantities["items"][item.id] ?? 0, // Default to 0 if not in the mapping
            },
        },
    })).filter((item) => item?.quantity?.selected?.count > 0);
	
	items = updatedItems;
	createAndAppendFulfillments(updatedItems, fulfillments);
	const quote = createQuoteFromItems(updatedItems);
	existingPayload.message.order.items = items;
	existingPayload.message.order.fulfillments = fulfillments; 
	existingPayload.message.order.fulfillments.forEach((fulfillment: any) => {
		if (fulfillment && fulfillment.type === "ROUTE") {
			fulfillment.type = "TRIP";
		}
	})
	existingPayload = updateProviderTime(existingPayload)
	existingPayload.message.order.quote = quote;
	return existingPayload;
}