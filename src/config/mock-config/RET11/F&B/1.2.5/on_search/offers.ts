export const discount = [
	{
		id: "discp60",
		descriptor: {
			code: "discount",
			images: ["https://snp.com/images/offer1-banner.webp"],
		},
		location_ids: [],
		category_ids: [],
		item_ids: ["I1"],
		time: {
			label: "valid",
			range: {
				start: "2025-01-01T16:00:00.000Z",
				end: "2027-01-01T23:00:00.000Z",
			},
		},
		tags: [
			{
				code: "qualifier",
				list: [
					{
						code: "min_value",
						value: "159.00",
					},
				],
			},
			{
				code: "benefit",
				list: [
					{
						code: "value_type",
						value: "percent",
					},
					{
						code: "value",
						value: "-60.00",
					},
					{
						code: "value_cap",
						value: "-120.00",
					},
				],
			},
			{
				code: "meta",
				list: [
					{
						code: "additive",
						value: "yes",
					},
					{
						code: "auto",
						value: "no",
					},
				],
			},
		],
	},
	{
		id: "flat150",
		descriptor: {
			code: "discount",
			images: ["https://snp.com/images/offer2-banner.webp"],
		},
		location_ids: ["L1"],
		category_ids: ["C1", "C2"],
		item_ids: ["I1"],
		time: {
			label: "valid",
			range: {
				start: "2025-01-01T16:00:00.000Z",
				end: "2025-01-01T23:00:00.000Z",
			},
		},
		tags: [
			{
				code: "qualifier",
				list: [
					{
						code: "min_value",
						value: "499.00",
					},
				],
			},
			{
				code: "benefit",
				list: [
					{
						code: "value_type",
						value: "amount",
					},
					{
						code: "value",
						value: "-150.00",
					},
				],
			},
			{
				code: "meta",
				list: [
					{
						code: "additive",
						value: "yes",
					},
					{
						code: "auto",
						value: "no",
					},
				],
			},
		],
	},
];

export const buyXgetY = [
	{
		id: "buy2get3",
		descriptor: {
			code: "buyXgetY",
			images: ["https://snp.com/images/offer1-banner.webp"],
		},
		location_ids: ["L1"],
		category_ids: ["C1"],
		item_ids: ["I1", "I2"],
		time: {
			label: "valid",
			range: {
				start: "2025-01-01T16:00:00.000Z",
				end: "2025-01-01T23:00:00.000Z",
			},
		},
		tags: [
			{
				code: "qualifier",
				list: [
					{
						code: "item_count",
						value: "2",
					},
				],
			},
			{
				code: "benefit",
				list: [
					{
						code: "item_count",
						value: "1",
					},
					{
						code: "item_id",
						value: "I2",
					},
					{
						code: "item_value",
						value: "0.00",
					},
				],
			},
			{
				code: "meta",
				list: [
					{
						code: "additive",
						value: "no",
					},
					{
						code: "auto",
						value: "yes",
					},
				],
			},
		],
	},
];
