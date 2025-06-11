import { SessionData } from "../../../../session-types";
import { Quote } from "../../api-objects/breakup-type";
import { Fulfillment, Fulfillments } from "../../api-objects/fulfillments";

const rtoFulfillment = {
	id: "rto_mock_id_121",
	type: "RTO",
	state: {
		descriptor: {
			code: "RTO-Initiated",
		},
	},
	start: {
		contact: {
			email: "mishratanishq619@gmail.com",
			phone: "9399788618",
		},
		location: {
			gps: "12.966545,77.592074",
			address: {
				name: "Tanishq Mishra",
				building: "New_Building",
				locality: "6th Cross Road",
				city: "Bengaluru",
				state: "Karnataka",
				country: "IND",
				area_code: "560027",
			},
		},
		time: {
			timestamp: "2024-08-08T10:11:24.749Z",
		},
	},
	end: {
		location: {
			id: "668e238e1b106d310473ddb0",
			descriptor: {
				name: "Seller Business",
			},
			gps: "12.92580970146639,77.58362409712942",
			address: {
				locality: "Jayanagar",
				city: "Bengaluru",
				area_code: "560011",
				state: "Karnataka",
			},
		},
		contact: {
			email: "test@gmail.com",
			phone: "9876543210",
		},
	},
	tags: [
		{
			code: "quote_trail",
			list: [
				{
					code: "type",
					value: "item",
				},
				{
					code: "id",
					value: "839cb128-34bd-444d-9ffc-05903e62b35a",
				},
				{
					code: "currency",
					value: "INR",
				},
				{
					code: "value",
					value: "-2260.00",
				},
			],
		},
	],
};

function createRtoFulfillment(
	deliveryFulfillment: Fulfillment,
	items: {
		id: string;
		count: number;
		price: number;
	}[],
	quote: Quote
) {
	const rtoClone = JSON.parse(JSON.stringify(rtoFulfillment)) as Fulfillment;
	const breakup = quote.breakup ?? [];
	if (quote.price) {
		quote.price.value = "0.00";
	}
	rtoClone.tags = breakup
		.map((item) => {
			const price = parseFloat(item.price?.value || "0");
			if (price === 0) return null;
			if (item.price) {
				item.price.value = "0.00";
			}
			if (item["@ondc/org/item_quantity"]) {
				item["@ondc/org/item_quantity"].count = 0;
			}
			return {
				code: "quote_trail",
				list: [
					{ code: "type", value: item["@ondc/org/title_type"] },
					{ code: "id", value: item["@ondc/org/item_id"] },
					{ code: "currency", value: "INR" },
					{ code: "value", value: `${-1 * price}` },
				],
			};
		})
		.filter((x): x is NonNullable<typeof x> => x !== null);
	delete deliveryFulfillment.end?.time;
	rtoClone.start = {
		...deliveryFulfillment.end,
		time: {
			timestamp: new Date().toISOString(),
		},
	};
	rtoClone.end = {
		...deliveryFulfillment.start,
	};
	return rtoClone;
}

export async function on_cancel_rto_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	console.log("generating on_cancel_rto payload");
	existingPayload.message.order.id = sessionData.order_id;
	existingPayload.message.order.created_at = sessionData.order_created_at;
	existingPayload.message.order.updated_at = new Date().toISOString();
	existingPayload.message.order.payment = sessionData.payment;
	existingPayload.message.order.billing = sessionData.billing;
	existingPayload.message.order.provider = sessionData.provider;
	console.log(sessionData.items);
	let mapRtoItems = sessionData.items.map((item: any) => {
		if (item.fulfillment_id === "F1" && item.quantity.count > 0) {
			const ob = {
				id: item.id,
				quantity: {
					count: item.quantity.count,
				},
				fulfillment_id: rtoFulfillment.id,
			};
			item.quantity.count = 0; // Set the count to 0 for RTO items
			return ob;
		}
		return undefined;
	});
	mapRtoItems = mapRtoItems.filter((item: any) => {
		return item;
	});
	console.log("mapRtoItems", mapRtoItems);
	existingPayload.message.order.items = [...sessionData.items, ...mapRtoItems];
	const items: {
		id: string;
		count: number;
		price: number;
		fulfillment_id: string;
	}[] = sessionData.items.map((item: any) => {
		return {
			id: item.id,
			count: 0,
			price: sessionData.quote.breakup.find(
				(b: any) => b["@ondc/org/item_id"] === item.id
			).price.value,
			fulfillment_id: item.fulfillment_id,
		};
	});

	const savedFulfillments = sessionData.fulfillments as Fulfillments;
	const deliveryFulfillment = savedFulfillments.find(
		(f: any) => f.type === "Delivery"
	) as Fulfillment;

	const f1 = savedFulfillments.find((f: any) => f.id === "F1") as Fulfillment;
	const prevState = f1.state?.descriptor?.code || "Out-for-delivery";
	f1.state = {
		descriptor: {
			code: "Cancelled",
		},
	};
	f1.tags = [
		...(f1.tags ?? []),
		{
			code: "cancel_request",
			list: [
				{
					code: "retry_count",
					value: "3",
				},
				{
					code: "rto_id",
					value: rtoFulfillment.id,
				},
				{
					code: "reason_id",
					value: "013",
				},
				{
					code: "initiated_by",
					value: sessionData.bpp_id,
				},
			],
		},
		{
			code: "precancel_state",
			list: [
				{
					code: "fulfillment_state",
					value: prevState,
				},
				{
					code: "updated_at",
					value: sessionData.last_updated_at || "",
				},
			],
		},
	];

	existingPayload.message.order.fulfillments = [
		...savedFulfillments,
		createRtoFulfillment(
			deliveryFulfillment,
			items,
			sessionData.quote as Quote
		),
	];
	existingPayload.message.order.quote = sessionData.quote;
	return existingPayload;
}
