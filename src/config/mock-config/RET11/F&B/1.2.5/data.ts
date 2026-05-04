export const on_search_items = [
  {
    id: "I1",
    time: {
      label: "enable",
      timestamp: "2025-01-08T07:30:00.000Z",
    },
    rating: "4",
    descriptor: {
      name: "Farm House Pizza",
      symbol: "https://snp.com/images/i1.png",
      short_desc: "Farm House Pizza",
      long_desc: "Farm House Pizza",
      images: ["https://snp.com/images/i1.png"],
    },
    quantity: {
      unitized: {
        measure: {
          unit: "unit",
          value: "1",
        },
      },
      available: {
        count: "99",
      },
      maximum: {
        count: "99",
      },
    },
    price: {
      currency: "INR",
      value: "269.00",
      maximum_value: "269.00",
      tags: [
        {
          code: "range",
          list: [
            {
              code: "lower",
              value: "269.00",
            },
            {
              code: "upper",
              value: "894.00",
            },
          ],
        },
      ],
    },
    category_id: "F&B",
    category_ids: ["5:1"],
    fulfillment_id: "F1",
    location_id: "L1",
    related: false,
    recommended: true,
    "@ondc/org/returnable": false,
    "@ondc/org/cancellable": false,
    "@ondc/org/return_window": "PT1H",
    "@ondc/org/seller_pickup_return": false,
    "@ondc/org/time_to_ship": "PT45M",
    "@ondc/org/available_on_cod": false,
    "@ondc/org/contact_details_consumer_care":
      "Ramesh,ramesh@abc.com,18004254444",
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "item",
          },
        ],
      },
      {
        code: "custom_group",
        list: [
          {
            code: "id",
            value: "CG1",
          },
        ],
      },
      {
        code: "timing",
        list: [
          {
            code: "day_from",
            value: "1",
          },
          {
            code: "day_to",
            value: "5",
          },
          {
            code: "time_from",
            value: "1800",
          },
          {
            code: "time_to",
            value: "2200",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C1",
    descriptor: {
      name: "New Hand Tossed",
    },
    quantity: {
      unitized: {
        measure: {
          unit: "unit",
          value: "1",
        },
      },
      available: {
        count: "99",
      },
      maximum: {
        count: "99",
      },
    },
    price: {
      currency: "INR",
      value: "0.00",
      maximum_value: "0.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG1",
          },
          {
            code: "default",
            value: "yes",
          },
        ],
      },
      {
        code: "child",
        list: [
          {
            code: "id",
            value: "CG2",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C2",
    descriptor: {
      name: "100% Wheat Thin Crust",
    },
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
      value: "0.00",
      maximum_value: "0.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG1",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "child",
        list: [
          {
            code: "id",
            value: "CG3",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C3",
    descriptor: {
      name: "Regular",
    },
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
      value: "0.00",
      maximum_value: "0.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG2",
          },
          {
            code: "default",
            value: "yes",
          },
        ],
      },
      {
        code: "child",
        list: [
          {
            code: "id",
            value: "CG4",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C4",
    descriptor: {
      name: "Large",
    },
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
      value: "450.00",
      maximum_value: "450.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG2",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "child",
        list: [
          {
            code: "id",
            value: "CG5",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C5",
    descriptor: {
      name: "Medium",
    },
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
      value: "210.00",
      maximum_value: "210.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG2",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "child",
        list: [
          {
            code: "id",
            value: "CG6",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C6",
    descriptor: {
      name: "Regular",
    },
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
      value: "45.00",
      maximum_value: "45.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG3",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "child",
        list: [
          {
            code: "id",
            value: "CG4",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C7",
    descriptor: {
      name: "Medium",
    },
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
      value: "275.00",
      maximum_value: "275.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG3",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "child",
        list: [
          {
            code: "id",
            value: "CG6",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C8",
    descriptor: {
      name: "Grilled Mushrooms",
    },
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
      value: "35.00",
      maximum_value: "35.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG4",
          },
          {
            code: "default",
            value: "yes",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C9",
    descriptor: {
      name: "Fresh Tomato",
    },
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
      value: "35.00",
      maximum_value: "35.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG4",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C10",
    descriptor: {
      name: "Pepper Barbeque Chicken",
    },
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
      value: "50.00",
      maximum_value: "50.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG4",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "non_veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C11",
    descriptor: {
      name: "Grilled Mushrooms",
    },
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
      value: "80.00",
      maximum_value: "80.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG5",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C12",
    descriptor: {
      name: "Fresh Tomato",
    },
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
      value: "80.00",
      maximum_value: "80.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG5",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C13",
    descriptor: {
      name: "Pepper Barbeque Chicken",
    },
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
      value: "95.00",
      maximum_value: "95.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG5",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "non_veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C14",
    descriptor: {
      name: "Grilled Mushrooms",
    },
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
      value: "80.00",
      maximum_value: "80.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG6",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C15",
    descriptor: {
      name: "Fresh Tomato",
    },
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
      value: "80.00",
      maximum_value: "80.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG6",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C16",
    descriptor: {
      name: "Pepper Barbeque Chicken",
    },
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
      value: "95.00",
      maximum_value: "95.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG6",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "non_veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "I2",
    time: {
      label: "enable",
      timestamp: "2025-01-08T07:30:00.000Z",
    },
    rating: "4",
    descriptor: {
      name: "Mexican Patty Sandwich",
      symbol: "https://snp.com/images/i1.png",
      short_desc: "Mexican Patty Sandwich",
      long_desc: "Mexican Patty Sandwich",
      images: ["https://snp.com/images/i1.png"],
    },
    quantity: {
      unitized: {
        measure: {
          unit: "unit",
          value: "1",
        },
      },
      available: {
        count: "99",
      },
      maximum: {
        count: "99",
      },
    },
    price: {
      currency: "INR",
      value: "229.00",
      maximum_value: "229.00",
      tags: [
        {
          code: "range",
          list: [
            {
              code: "lower",
              value: "229.00",
            },
            {
              code: "upper",
              value: "718.00",
            },
          ],
        },
      ],
    },
    category_id: "F&B",
    category_ids: ["5:1"],
    fulfillment_id: "F1",
    location_id: "L1",
    related: false,
    recommended: true,
    "@ondc/org/returnable": false,
    "@ondc/org/cancellable": false,
    "@ondc/org/return_window": "PT1H",
    "@ondc/org/seller_pickup_return": false,
    "@ondc/org/time_to_ship": "PT45M",
    "@ondc/org/available_on_cod": false,
    "@ondc/org/contact_details_consumer_care":
      "Ramesh,ramesh@abc.com,18004254444",
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "item",
          },
        ],
      },
      {
        code: "custom_group",
        list: [
          {
            code: "id",
            value: "CG11",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C17",
    descriptor: {
      name: "Mexican Bean Patty 15cm [6 inches]",
    },
    quantity: {
      unitized: {
        measure: {
          unit: "unit",
          value: "1",
        },
      },
      available: {
        count: "99",
      },
      maximum: {
        count: "99",
      },
    },
    price: {
      currency: "INR",
      value: "0.00",
      maximum_value: "0.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG11",
          },
          {
            code: "default",
            value: "yes",
          },
        ],
      },
      {
        code: "child",
        list: [
          {
            code: "id",
            value: "CG12",
          },
          {
            code: "id",
            value: "CG13",
          },
          {
            code: "id",
            value: "CG14",
          },
          {
            code: "id",
            value: "CG16",
          },
          {
            code: "id",
            value: "CG17",
          },
          {
            code: "id",
            value: "CG18",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C18",
    descriptor: {
      name: "Make Cheese Pull Mexican Patty 30cm",
    },
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
      value: "270.00",
      maximum_value: "270.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG11",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "child",
        list: [
          {
            code: "id",
            value: "CG12",
          },
          {
            code: "id",
            value: "CG15",
          },
          {
            code: "id",
            value: "CG17",
          },
          {
            code: "id",
            value: "CG18",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C19",
    descriptor: {
      name: "Multigrain Honey Oats",
    },
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
      value: "0.00",
      maximum_value: "0.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG12",
          },
          {
            code: "default",
            value: "yes",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C20",
    descriptor: {
      name: "Parmesan Oregano",
    },
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
      value: "0.00",
      maximum_value: "0.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG12",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C21",
    descriptor: {
      name: "Plain bread",
    },
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
      value: "0.00",
      maximum_value: "0.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG13",
          },
          {
            code: "default",
            value: "yes",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C22",
    descriptor: {
      name: "Toasted bread",
    },
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
      value: "0.00",
      maximum_value: "0.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG13",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C23",
    descriptor: {
      name: "Extra Cheese Slice",
    },
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
      value: "30.00",
      maximum_value: "30.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG14",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C24",
    descriptor: {
      name: "Extra Mexican Bean Patty Footlong",
    },
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
      value: "120.00",
      maximum_value: "120.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG15",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C25",
    descriptor: {
      name: "Lettuce",
    },
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
      value: "0.00",
      maximum_value: "0.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG16",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C26",
    descriptor: {
      name: "Eggless Mayo",
    },
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
      value: "0.00",
      maximum_value: "0.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG17",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
  {
    id: "C27",
    descriptor: {
      name: "Dark Chunk Choc Cookies",
    },
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
      value: "99.00",
      maximum_value: "99.00",
    },
    category_id: "F&B",
    related: true,
    tags: [
      {
        code: "type",
        list: [
          {
            code: "type",
            value: "customization",
          },
        ],
      },
      {
        code: "parent",
        list: [
          {
            code: "id",
            value: "CG18",
          },
          {
            code: "default",
            value: "no",
          },
        ],
      },
      {
        code: "veg_nonveg",
        list: [
          {
            code: "veg",
            value: "yes",
          },
        ],
      },
    ],
  },
];

export const on_search_offers = [
  {
    id: "discp60",
    descriptor: {
      code: "discount",
      images: ["https://snp.com/images/offer1-banner.webp"],
    },
    location_ids: ["L1"],
    category_ids: ["C1"],
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

export type Fulfillment = {
  /**
   * Unique reference ID to the fulfillment of an order
   */
  id?: string;
  /**
   * This describes the type of fulfillment ("Pickup" - Buyer picks up from store by themselves or through their logistics provider; "Delivery" - seller delivers to buyer)
   */
  type?: string;
  /**
   * fulfillment turnaround time in ISO8601 durations format e.g. 'PT24H' indicates 24 hour TAT
   */
  "@ondc/org/TAT"?: string;
  "@ondc/org/provider_name"?: string;
  provider_id?: string;
  /**
   * Describes the properties of a vehicle used in a mobility service
   */
  vehicle?: {
    registration?: string;
    [k: string]: unknown;
  };
  /**
   * Describes an order executor
   */
  agent?: {
    phone?: string;
    email?: string;
    [k: string]: unknown;
  };
  /**
   * Rating value given to the object (1 - Poor; 2 - Needs improvement; 3 - Satisfactory; 4 - Good; 5 - Excellent)
   */
  rating?: number;
  /**
   * Describes a state
   */
  state?: {
    /**
     * Describes the description of a real-world object.
     */
    descriptor?: {
      code?: string;
      name?: string;
      short_desc?: string;
      [k: string]: unknown;
    };
    updated_at?: string;
    [k: string]: unknown;
  };
  /**
   * Indicates whether the fulfillment allows tracking
   */
  tracking?: boolean;
  /**
   * Details on the start of fulfillment
   */
  start?: {
    /**
     * Describes the location of a runtime object.
     */
    location?: {
      id?: string;
      /**
       * Describes the description of a real-world object.
       */
      descriptor?: {
        code?: string;
        name?: string;
        short_desc?: string;
        [k: string]: unknown;
      };
      /**
       * Describes a gps coordinate
       */
      gps?: string;
      /**
       * Describes an address
       */
      address?: {
        /**
         * Name of address if applicable. Example, shop name
         */
        name?: string;
        /**
         * Name of the building or block
         */
        building?: string;
        /**
         * Street name or number
         */
        street?: string;
        /**
         * Name of the locality, apartments
         */
        locality?: string;
        /**
         * City name
         */
        city?: string;
        /**
         * State name
         */
        state?: string;
        /**
         * Country name
         */
        country?: string;
        /**
         * Area code. This can be Pincode, ZIP code or any equivalent
         */
        area_code?: string;
        [k: string]: unknown;
      };
      /**
       * Describes the location of a runtime object.
       */
      location?: {
        id?: string;
        /**
         * Describes the description of a real-world object.
         */
        descriptor?: {
          name?: string;
          code?: string;
          symbol?: string;
          short_desc?: string;
          long_desc?: string;
          images?: string[];
          tags?: {
            /**
             * The machine-readable name of the tag group. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value. Values outside the allowed values may or may not be ignored by the rendering platform. As this schema is purely for catalog display purposes, it is not recommended to send this value during search.
             */
            code?: string;
            /**
             * An array of Tag objects listed under this group. This property can be set by BAPs during search to narrow the `search` and achieve more relevant results. When received during `on_search`, BAPs must render this list under the heading described by the `name` property of this schema.
             */
            list?: {
              /**
               * The machine-readable name of the tag. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value.
               */
              code?: string;
              /**
               * The human-readable name of the tag. This set by the BPP and rendered as-is by the BAP. Sometimes, the network policy may reserve some names for this property. Values outside the reserved values can be set by the BPP. However,the BAP may choose to rename or even ignore this value and render the output purely using the `code` property, but it is recommended for BAPs to keep the name same to avoid confusion and provide consistency.
               */
              name?: string;
              /**
               * The value of the tag. This set by the BPP and rendered as-is by the BAP.
               */
              value?: string;
              [k: string]: unknown;
            }[];
            [k: string]: unknown;
          }[];
          [k: string]: unknown;
        };
        /**
         * Describes a gps coordinate
         */
        gps?: string;
        /**
         * Describes an address
         */
        address?: {
          /**
           * Name of address if applicable. Example, shop name
           */
          name?: string;
          /**
           * Name of the building or block
           */
          building?: string;
          /**
           * Street name or number
           */
          street?: string;
          /**
           * Name of the locality, apartments
           */
          locality?: string;
          /**
           * City name
           */
          city?: string;
          /**
           * State name
           */
          state?: string;
          /**
           * Country name
           */
          country?: string;
          /**
           * Area code. This can be Pincode, ZIP code or any equivalent
           */
          area_code?: string;
          [k: string]: unknown;
        };
        /**
         * Describes a city
         */
        city?: {
          /**
           * Name of the city
           */
          name?: string;
          /**
           * Codification of city code will be using the std code of the city e.g. for Bengaluru, city code is 'std:080'
           */
          code?: string;
          [k: string]: unknown;
        };
        /**
         * Describes a state.
         */
        state?: {
          /**
           * Name of the state
           */
          name?: string;
          /**
           * State code as per ISO 3166 Alpha-2 code format
           */
          code?: string;
          [k: string]: unknown;
        };
        /**
         * Describes time in its various forms. It can be a single point in time; duration; or a structured timetable of operations
         */
        time?: {
          label?: string;
          timestamp?: string;
          range?: {
            start?: string;
            end?: string;
            [k: string]: unknown;
          };
          /**
           * comma separated values representing days of the week
           */
          days?: string;
          /**
           * Describes a schedule
           */
          schedule?: {
            /**
             * Describes duration as per ISO8601 format
             */
            frequency?: string;
            holidays?: string[];
            times?: string[];
            [k: string]: unknown;
          };
          [k: string]: unknown;
        };
        /**
         * Describes a circular area on the map
         */
        circle?: {
          /**
           * Describes a gps coordinate
           */
          gps?: string;
          /**
           * An object representing a scalar quantity.
           */
          radius?: {
            type?: string;
            value?: string;
            estimated_value?: number;
            computed_value?: number;
            range?: {
              min?: number;
              max?: number;
              [k: string]: unknown;
            };
            unit?: string;
            [k: string]: unknown;
          };
          [k: string]: unknown;
        };
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
    /**
     * Describes time in its various forms. It can be a single point in time; duration; or a structured timetable of operations
     */
    time?: {
      label?: string;
      timestamp?: string;
      range?: {
        start?: string;
        end?: string;
        [k: string]: unknown;
      };
      /**
       * comma separated values representing days of the week
       */
      days?: string;
      /**
       * Describes a schedule
       */
      schedule?: {
        /**
         * Describes duration as per ISO8601 format
         */
        frequency?: string;
        holidays?: string[];
        times?: string[];
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
    /**
     * Describes the description of a real-world object.
     */
    instructions?: {
      name?: string;
      code?: string;
      symbol?: string;
      short_desc?: string;
      long_desc?: string;
      images?: string[];
      tags?: {
        /**
         * The machine-readable name of the tag group. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value. Values outside the allowed values may or may not be ignored by the rendering platform. As this schema is purely for catalog display purposes, it is not recommended to send this value during search.
         */
        code?: string;
        /**
         * An array of Tag objects listed under this group. This property can be set by BAPs during search to narrow the `search` and achieve more relevant results. When received during `on_search`, BAPs must render this list under the heading described by the `name` property of this schema.
         */
        list?: {
          /**
           * The machine-readable name of the tag. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value.
           */
          code?: string;
          /**
           * The human-readable name of the tag. This set by the BPP and rendered as-is by the BAP. Sometimes, the network policy may reserve some names for this property. Values outside the reserved values can be set by the BPP. However,the BAP may choose to rename or even ignore this value and render the output purely using the `code` property, but it is recommended for BAPs to keep the name same to avoid confusion and provide consistency.
           */
          name?: string;
          /**
           * The value of the tag. This set by the BPP and rendered as-is by the BAP.
           */
          value?: string;
          [k: string]: unknown;
        }[];
        [k: string]: unknown;
      }[];
      [k: string]: unknown;
    };
    contact?: {
      phone?: string;
      email?: string;
      [k: string]: unknown;
    };
    /**
     * Describes a person.
     */
    person?: {
      /**
       * Describes the name of a person.
       */
      name?: string;
      [k: string]: unknown;
    };
    /**
     * Describes an authorization mechanism
     */
    authorization?: {
      /**
       * Type of authorization mechanism used
       */
      type?: string;
      /**
       * Token used for authorization
       */
      token?: string;
      /**
       * Timestamp in RFC3339 format from which token is valid
       */
      valid_from?: string;
      /**
       * Timestamp in RFC3339 format until which token is valid
       */
      valid_to?: string;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  /**
   * Details on the end of fulfillment
   */
  end?: {
    /**
     * Describes the location of a runtime object.
     */
    location?: {
      id?: string;
      /**
       * Describes the description of a real-world object.
       */
      descriptor?: {
        code?: string;
        name?: string;
        short_desc?: string;
        [k: string]: unknown;
      };
      /**
       * Describes a gps coordinate
       */
      gps?: string;
      /**
       * Describes an address
       */
      address?: {
        /**
         * Name of address if applicable. Example, shop name
         */
        name?: string;
        /**
         * Name of the building or block
         */
        building?: string;
        /**
         * Street name or number
         */
        street?: string;
        /**
         * Name of the locality, apartments
         */
        locality?: string;
        /**
         * City name
         */
        city?: string;
        /**
         * State name
         */
        state?: string;
        /**
         * Country name
         */
        country?: string;
        /**
         * Area code. This can be Pincode, ZIP code or any equivalent
         */
        area_code?: string;
        [k: string]: unknown;
      };
      /**
       * Describes the location of a runtime object.
       */
      location?: {
        id?: string;
        /**
         * Describes the description of a real-world object.
         */
        descriptor?: {
          name?: string;
          code?: string;
          symbol?: string;
          short_desc?: string;
          long_desc?: string;
          images?: string[];
          tags?: {
            /**
             * The machine-readable name of the tag group. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value. Values outside the allowed values may or may not be ignored by the rendering platform. As this schema is purely for catalog display purposes, it is not recommended to send this value during search.
             */
            code?: string;
            /**
             * An array of Tag objects listed under this group. This property can be set by BAPs during search to narrow the `search` and achieve more relevant results. When received during `on_search`, BAPs must render this list under the heading described by the `name` property of this schema.
             */
            list?: {
              /**
               * The machine-readable name of the tag. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value.
               */
              code?: string;
              /**
               * The human-readable name of the tag. This set by the BPP and rendered as-is by the BAP. Sometimes, the network policy may reserve some names for this property. Values outside the reserved values can be set by the BPP. However,the BAP may choose to rename or even ignore this value and render the output purely using the `code` property, but it is recommended for BAPs to keep the name same to avoid confusion and provide consistency.
               */
              name?: string;
              /**
               * The value of the tag. This set by the BPP and rendered as-is by the BAP.
               */
              value?: string;
              [k: string]: unknown;
            }[];
            [k: string]: unknown;
          }[];
          [k: string]: unknown;
        };
        /**
         * Describes a gps coordinate
         */
        gps?: string;
        /**
         * Describes an address
         */
        address?: {
          /**
           * Name of address if applicable. Example, shop name
           */
          name?: string;
          /**
           * Name of the building or block
           */
          building?: string;
          /**
           * Street name or number
           */
          street?: string;
          /**
           * Name of the locality, apartments
           */
          locality?: string;
          /**
           * City name
           */
          city?: string;
          /**
           * State name
           */
          state?: string;
          /**
           * Country name
           */
          country?: string;
          /**
           * Area code. This can be Pincode, ZIP code or any equivalent
           */
          area_code?: string;
          [k: string]: unknown;
        };
        /**
         * Describes a city
         */
        city?: {
          /**
           * Name of the city
           */
          name?: string;
          /**
           * Codification of city code will be using the std code of the city e.g. for Bengaluru, city code is 'std:080'
           */
          code?: string;
          [k: string]: unknown;
        };
        /**
         * Describes a state.
         */
        state?: {
          /**
           * Name of the state
           */
          name?: string;
          /**
           * State code as per ISO 3166 Alpha-2 code format
           */
          code?: string;
          [k: string]: unknown;
        };
        /**
         * Describes time in its various forms. It can be a single point in time; duration; or a structured timetable of operations
         */
        time?: {
          label?: string;
          timestamp?: string;
          range?: {
            start?: string;
            end?: string;
            [k: string]: unknown;
          };
          /**
           * comma separated values representing days of the week
           */
          days?: string;
          /**
           * Describes a schedule
           */
          schedule?: {
            /**
             * Describes duration as per ISO8601 format
             */
            frequency?: string;
            holidays?: string[];
            times?: string[];
            [k: string]: unknown;
          };
          [k: string]: unknown;
        };
        /**
         * Describes a circular area on the map
         */
        circle?: {
          /**
           * Describes a gps coordinate
           */
          gps?: string;
          /**
           * An object representing a scalar quantity.
           */
          radius?: {
            type?: string;
            value?: string;
            estimated_value?: number;
            computed_value?: number;
            range?: {
              min?: number;
              max?: number;
              [k: string]: unknown;
            };
            unit?: string;
            [k: string]: unknown;
          };
          [k: string]: unknown;
        };
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
    /**
     * Describes time in its various forms. It can be a single point in time; duration; or a structured timetable of operations
     */
    time?: {
      label?: string;
      timestamp?: string;
      range?: {
        start?: string;
        end?: string;
        [k: string]: unknown;
      };
      /**
       * comma separated values representing days of the week
       */
      days?: string;
      /**
       * Describes a schedule
       */
      schedule?: {
        /**
         * Describes duration as per ISO8601 format
         */
        frequency?: string;
        holidays?: string[];
        times?: string[];
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
    /**
     * Describes the description of a real-world object.
     */
    instructions?: {
      name?: string;
      code?: string;
      symbol?: string;
      short_desc?: string;
      long_desc?: string;
      images?: string[];
      tags?: {
        /**
         * The machine-readable name of the tag group. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value. Values outside the allowed values may or may not be ignored by the rendering platform. As this schema is purely for catalog display purposes, it is not recommended to send this value during search.
         */
        code?: string;
        /**
         * An array of Tag objects listed under this group. This property can be set by BAPs during search to narrow the `search` and achieve more relevant results. When received during `on_search`, BAPs must render this list under the heading described by the `name` property of this schema.
         */
        list?: {
          /**
           * The machine-readable name of the tag. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value.
           */
          code?: string;
          /**
           * The human-readable name of the tag. This set by the BPP and rendered as-is by the BAP. Sometimes, the network policy may reserve some names for this property. Values outside the reserved values can be set by the BPP. However,the BAP may choose to rename or even ignore this value and render the output purely using the `code` property, but it is recommended for BAPs to keep the name same to avoid confusion and provide consistency.
           */
          name?: string;
          /**
           * The value of the tag. This set by the BPP and rendered as-is by the BAP.
           */
          value?: string;
          [k: string]: unknown;
        }[];
        [k: string]: unknown;
      }[];
      [k: string]: unknown;
    };
    contact?: {
      phone?: string;
      email?: string;
      [k: string]: unknown;
    };
    /**
     * Describes a person.
     */
    person?: {
      /**
       * Describes the name of a person.
       */
      name?: string;
      [k: string]: unknown;
    };
    /**
     * Describes an authorization mechanism
     */
    authorization?: {
      /**
       * Type of authorization mechanism used
       */
      type?: string;
      /**
       * Token used for authorization
       */
      token?: string;
      /**
       * Timestamp in RFC3339 format from which token is valid
       */
      valid_from?: string;
      /**
       * Timestamp in RFC3339 format until which token is valid
       */
      valid_to?: string;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  tags?: {
    /**
     * The machine-readable name of the tag group. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value. Values outside the allowed values may or may not be ignored by the rendering platform. As this schema is purely for catalog display purposes, it is not recommended to send this value during search.
     */
    code?: string;
    /**
     * An array of Tag objects listed under this group. This property can be set by BAPs during search to narrow the `search` and achieve more relevant results. When received during `on_search`, BAPs must render this list under the heading described by the `name` property of this schema.
     */
    list?: {
      /**
       * The machine-readable name of the tag. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value.
       */
      code?: string;
      /**
       * The human-readable name of the tag. This set by the BPP and rendered as-is by the BAP. Sometimes, the network policy may reserve some names for this property. Values outside the reserved values can be set by the BPP. However,the BAP may choose to rename or even ignore this value and render the output purely using the `code` property, but it is recommended for BAPs to keep the name same to avoid confusion and provide consistency.
       */
      name?: string;
      /**
       * The value of the tag. This set by the BPP and rendered as-is by the BAP.
       */
      value?: string;
      [k: string]: unknown;
    }[];
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
};
export type Fulfillments = Fulfillment[];

export interface Quote {
	/**
	 * Describes the price of an item. Allows for domain extension.
	 */
	price?: {
		/**
		 * ISO 4217 alphabetic currency code e.g. 'INR'
		 */
		currency?: string;
		/**
		 * Describes a decimal value
		 */
		value?: string;
		/**
		 * A collection of tag objects with group level attributes. For detailed documentation on the Tags and Tag Groups schema go to https://github.com/beckn/protocol-specifications/discussions/316
		 */
		tags?: {
			/**
			 * The machine-readable name of the tag group. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value. Values outside the allowed values may or may not be ignored by the rendering platform. As this schema is purely for catalog display purposes, it is not recommended to send this value during search.
			 */
			code?: string;
			/**
			 * An array of Tag objects listed under this group. This property can be set by BAPs during search to narrow the `search` and achieve more relevant results. When received during `on_search`, BAPs must render this list under the heading described by the `name` property of this schema.
			 */
			list?: {
				/**
				 * The machine-readable name of the tag. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value.
				 */
				code?: string;
				/**
				 * The human-readable name of the tag. This set by the BPP and rendered as-is by the BAP. Sometimes, the network policy may reserve some names for this property. Values outside the reserved values can be set by the BPP. However,the BAP may choose to rename or even ignore this value and render the output purely using the `code` property, but it is recommended for BAPs to keep the name same to avoid confusion and provide consistency.
				 */
				name?: string;
				/**
				 * The value of the tag. This set by the BPP and rendered as-is by the BAP.
				 */
				value?: string;
				[k: string]: unknown;
			}[];
			[k: string]: unknown;
		};
		[k: string]: unknown;
	};
	breakup?: {
		/**
		 * This is the most unique identifier of a service item. An example of an Item ID could be the SKU of a product.
		 */
		"@ondc/org/item_id"?: string;
		"@ondc/org/item_quantity"?: {
			count?: number;
			[k: string]: unknown;
		};
		"@ondc/org/title_type"?: string;
		item?: {
			quantity?: {
				available?: {
					count?: string;
					[k: string]: unknown;
				};
				maximum?: {
					count?: string;
					[k: string]: unknown;
				};
				[k: string]: unknown;
			};
			/**
			 * This is the most unique identifier of a service item. An example of an Item ID could be the SKU of a product.
			 */
			parent_item_id?: string;
			/**
			 * Describes the price of an item. Allows for domain extension.
			 */
			price?: {
				/**
				 * ISO 4217 alphabetic currency code e.g. 'INR'
				 */
				currency?: string;
				/**
				 * Describes a decimal value
				 */
				value?: string;
				/**
				 * A collection of tag objects with group level attributes. For detailed documentation on the Tags and Tag Groups schema go to https://github.com/beckn/protocol-specifications/discussions/316
				 */
				tags?: {
					/**
					 * The machine-readable name of the tag group. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value. Values outside the allowed values may or may not be ignored by the rendering platform. As this schema is purely for catalog display purposes, it is not recommended to send this value during search.
					 */
					code?: string;
					/**
					 * An array of Tag objects listed under this group. This property can be set by BAPs during search to narrow the `search` and achieve more relevant results. When received during `on_search`, BAPs must render this list under the heading described by the `name` property of this schema.
					 */
					list?: {
						/**
						 * The machine-readable name of the tag. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value.
						 */
						code?: string;
						/**
						 * The human-readable name of the tag. This set by the BPP and rendered as-is by the BAP. Sometimes, the network policy may reserve some names for this property. Values outside the reserved values can be set by the BPP. However,the BAP may choose to rename or even ignore this value and render the output purely using the `code` property, but it is recommended for BAPs to keep the name same to avoid confusion and provide consistency.
						 */
						name?: string;
						/**
						 * The value of the tag. This set by the BPP and rendered as-is by the BAP.
						 */
						value?: string;
						[k: string]: unknown;
					}[];
					[k: string]: unknown;
				};
				[k: string]: unknown;
			};
			tags?: {
				/**
				 * The machine-readable name of the tag group. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value. Values outside the allowed values may or may not be ignored by the rendering platform. As this schema is purely for catalog display purposes, it is not recommended to send this value during search.
				 */
				code?: string;
				/**
				 * An array of Tag objects listed under this group. This property can be set by BAPs during search to narrow the `search` and achieve more relevant results. When received during `on_search`, BAPs must render this list under the heading described by the `name` property of this schema.
				 */
				list?: {
					/**
					 * The machine-readable name of the tag. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value.
					 */
					code?: string;
					/**
					 * The human-readable name of the tag. This set by the BPP and rendered as-is by the BAP. Sometimes, the network policy may reserve some names for this property. Values outside the reserved values can be set by the BPP. However,the BAP may choose to rename or even ignore this value and render the output purely using the `code` property, but it is recommended for BAPs to keep the name same to avoid confusion and provide consistency.
					 */
					name?: string;
					/**
					 * The value of the tag. This set by the BPP and rendered as-is by the BAP.
					 */
					value?: string;
					[k: string]: unknown;
				}[];
				[k: string]: unknown;
			}[];
			[k: string]: unknown;
		};
		title?: string;
		/**
		 * Describes the price of an item. Allows for domain extension.
		 */
		price?: {
			/**
			 * ISO 4217 alphabetic currency code e.g. 'INR'
			 */
			currency?: string;
			/**
			 * Describes a decimal value
			 */
			value?: string;
			/**
			 * A collection of tag objects with group level attributes. For detailed documentation on the Tags and Tag Groups schema go to https://github.com/beckn/protocol-specifications/discussions/316
			 */
			tags?: {
				/**
				 * The machine-readable name of the tag group. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value. Values outside the allowed values may or may not be ignored by the rendering platform. As this schema is purely for catalog display purposes, it is not recommended to send this value during search.
				 */
				code?: string;
				/**
				 * An array of Tag objects listed under this group. This property can be set by BAPs during search to narrow the `search` and achieve more relevant results. When received during `on_search`, BAPs must render this list under the heading described by the `name` property of this schema.
				 */
				list?: {
					/**
					 * The machine-readable name of the tag. The allowed values of this property can be published at three levels namely, a) Core specification, b) industry sector-specific adaptations, and c) Network-specific adaptations. Except core, each adaptation (sector or network) should prefix a unique namespace with the allowed value.
					 */
					code?: string;
					/**
					 * The human-readable name of the tag. This set by the BPP and rendered as-is by the BAP. Sometimes, the network policy may reserve some names for this property. Values outside the reserved values can be set by the BPP. However,the BAP may choose to rename or even ignore this value and render the output purely using the `code` property, but it is recommended for BAPs to keep the name same to avoid confusion and provide consistency.
					 */
					name?: string;
					/**
					 * The value of the tag. This set by the BPP and rendered as-is by the BAP.
					 */
					value?: string;
					[k: string]: unknown;
				}[];
				[k: string]: unknown;
			};
			[k: string]: unknown;
		};
		/**
		 * Describes duration as per ISO8601 format
		 */
		ttl?: string;
		[k: string]: unknown;
	}[];
	/**
	 * Validity of quote in ISO8601 durations format after which it has to be refreshed e.g. 'P7D' indicates validity of 7 days; value of 0 indicates quote is not cacheable
	 */
	ttl?: string;
	[k: string]: unknown;
}
