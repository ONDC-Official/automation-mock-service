export const RET16HOMEKITCHEN125Catalog = {
  catalog: {
    "bpp/fulfillments": [
      {
        id: "F1",
        type: "Delivery",
      },
      {
        id: "F2",
        type: "Self-Pickup",
      },
    ],
    "bpp/descriptor": {
      name: "Mock Seller NP",
      symbol: "https://sellerNP.com/images/np.png",
      short_desc: "Seller Marketplace",
      long_desc: "Seller Marketplace",
      images: ["https://sellerNP.com/images/np.png"],
      tags: [
        {
          code: "bpp_terms",
          list: [
            {
              code: "np_type",
              value: "MSN",
            },
            {
              code: "accept_bap_terms",
              value: "Y",
            },
          ],
        },
      ],
    },
    "bpp/providers": [
      {
        id: "P1",
        time: {
          label: "enable",
          timestamp: "2024-08-13T06:46:19.736Z",
        },
        rating: "4",
        ttl: "PT24H",
        locations: [
          {
            id: "L1",
            gps: "12.925810,77.583624",
            address: {
              city: "Bengaluru",
              state: "Karnataka",
              area_code: "560011",
              street: "Jayanagar",
              locality: "Jayanagar",
            },
            time: {
              label: "enable",
              timestamp: "2024-08-13T06:46:19.736Z",
              days: "1,2,3,4,5",
              schedule: {
                holidays: [],
              },
              range: {
                start: "0000",
                end: "2359",
              },
            },
            circle: {
              gps: "12.925810,77.583624",
              radius: {
                unit: "km",
                value: "5",
              },
            },
          },
        ],
        descriptor: {
          name: "Store 1",
          symbol: "https://sellerNP.com/images/store1.png",
          short_desc: "Store 1",
          long_desc: "Store 1",
          images: ["https://sellerNP.com/images/store1.png"],
        },
        categories: [
          {
            id: "V1",
            descriptor: {
              name: "Variant Group 1",
            },
            tags: [
              {
                code: "type",
                list: [
                  {
                    code: "type",
                    value: "variant_group",
                  },
                ],
              },
              {
                code: "attr",
                list: [
                  {
                    code: "name",
                    value: "item.tags.attribute.colour",
                  },
                  {
                    code: "seq",
                    value: "1",
                  },
                ],
              },
            ],
          },
        ],
        items: [
          {
            id: "I1",
            rating: "4",
            time: {
              label: "enable",
              timestamp: "2024-08-12T05:30:48.998Z",
            },
            descriptor: {
              name: "MINISO Two-Layer Drawer Organizer",
              symbol: "https://sellerNP.com/images/i1.png",
              short_desc:
                "Hard, tough and durable cosmetic storage and organizer, Two-Layer Drawer Organizer Cosmetic Storage Box, White, Rectangular",
              long_desc:
                "Introducing the MINISO Two-Layer Drawer Organizer Cosmetic Storage Box in a sleek, modern White, Rectangular design. Crafted with toughness and durability in mind, this organizer is built to withstand daily use, ensuring your items stay secure and protected.Its compact design offers simplicity and perfection, allowing you to maximize space while maintaining an elegant aesthetic.",
              images: ["https://sellerNP.com/images/i1.png"],
              code: "3:9501101530007",
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
                count: "8",
              },
            },
            price: {
              currency: "INR",
              value: "2260",
              maximum_value: "2260",
            },
            category_id: "Kitchen Storage and Containers",
            location_id: "L1",
            fulfillment_id: "F1",
            "@ondc/org/returnable": true,
            "@ondc/org/cancellable": true,
            "@ondc/org/available_on_cod": false,
            "@ondc/org/time_to_ship": "P2D",
            "@ondc/org/seller_pickup_return": true,
            "@ondc/org/return_window": "P7D",
            "@ondc/org/contact_details_consumer_care":
              "Seller Business,test@gmail.com,9876543210",
            "@ondc/org/statutory_reqs_packaged_commodities": {
              manufacturer_or_packer_name: "Seller Business",
              manufacturer_or_packer_address:
                "Seller Building Address, Jayanagar, Bengaluru, Karnataka, India - 560011",
              common_or_generic_name_of_commodity:
                "Kitchen Storage and Containers",
              month_year_of_manufacture_packing_import: "NA",
            },
            tags: [
              {
                code: "origin",
                list: [
                  {
                    code: "country",
                    value: "IND",
                  },
                ],
              },
              {
                code: "attribute",
                list: [
                  {
                    code: "brand",
                    value: "MINISO Two-Layer Drawer Organizer ",
                  },
                  {
                    code: "colour",
                    value: "#FFFFFF",
                  },
                  {
                    code: "colour_name",
                    value: "brown",
                  },
                  {
                    code: "material",
                    value: "thermoplastic",
                  },
                ],
              },
            ],
          },
          {
            id: "I2",
            rating: "3",
            time: {
              label: "enable",
              timestamp: "2024-08-12T10:27:48.913Z",
            },
            descriptor: {
              name: "Doms Art Apps Nxt Kit With Plastic Carry Case",
              symbol: "https://sellerNP.com/images/i1.png",
              short_desc:
                "Coloring & Art Smart Kit Use For Sketching, Writing, Shading, Colouring, Highlighting.Non-Toxic, Easy To Use & Safe For Childrens.",
              long_desc:
                "Introducing our comprehensive combination kit, designed to satisfy all your creative needs! Whether you're sketching, writing, shading, coloring, or highlighting, this kit has everything you need to unleash your imagination.You'll find 12 watercolor pens for vibrant and fluid artwork, 12 bi-color crayons for versatile coloring options, 12 jumbo oil pastels for smooth and blendable textures, 8 bi-color pencils for precise drawing and shading, and 12 plastic crayons for bold and durable lines.",
              images: ["https://sellerNP.com/images/i1.png"],
              code: "3:7845632198471",
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
                count: "10",
              },
            },
            price: {
              currency: "INR",
              value: "2460",
              maximum_value: "2460",
            },
            category_id: "Stationery",
            location_id: "L1",
            parent_item_id: "V1",
            fulfillment_id: "F1",
            "@ondc/org/returnable": true,
            "@ondc/org/cancellable": true,
            "@ondc/org/available_on_cod": false,
            "@ondc/org/time_to_ship": "P2D",
            "@ondc/org/seller_pickup_return": true,
            "@ondc/org/return_window": "P7D",
            "@ondc/org/contact_details_consumer_care":
              "Seller Business,test@gmail.com,9876543210",
            "@ondc/org/statutory_reqs_packaged_commodities": {
              manufacturer_or_packer_name: "Seller Business",
              manufacturer_or_packer_address:
                "Seller Building Address, Jayanagar, Bengaluru, Karnataka, India - 560011",
              common_or_generic_name_of_commodity: "Plastic Crayons",
              month_year_of_manufacture_packing_import: "NA",
            },
            tags: [
              {
                code: "origin",
                list: [
                  {
                    code: "country",
                    value: "IND",
                  },
                ],
              },
              {
                code: "attribute",
                list: [
                  {
                    code: "brand",
                    value: "Doms Art Apps Nxt Kit With Plastic Carry Case ",
                  },
                  {
                    code: "colour",
                    value: "#00FF00",
                  },
                  {
                    code: "colour_name",
                    value: "white",
                  },
                  {
                    code: "material",
                    value: "thermoplastic",
                  },
                ],
              },
            ],
          },
          {
            id: "I3",
            rating: "4",
            descriptor: {
              name: "Polyset Elegance Plastic Laundry Basket - Assorted Colour, 53 L",
              code: "3:6213574890238",
              symbol: "https://sellerNP.com/images/i1.png",
              short_desc:
                "Polyset’s Laundry Basket made from virgin plastic is very tough, durable and long-lasting. It has a large space enough to keep all the dirty clothes in one place.",
              long_desc:
                "This Polyset Laundry Basket comes in large size, which gives you more space for storing multiple items like clothes, toys, groceries, kitchen and bathing accessories, Ideal for family use in the Laundry Room, Bedroom or Bathroom, its comes with Lid for protecting your articles from dust. To add to it, the design and colour are so attractive, that it immediately gels with the interior of the house, be it Bathroom, Bedroom etc. Easily portable cross ventilating body keeps your items free module formation. And it gives you extra-large space to store your products. And this is made from tough plastic which provides immense strength to the product.",
              images: ["https://sellerNP.com/images/i1.png"],
            },
            price: {
              currency: "INR",
              value: "499.00",
              maximum_value: "1199.00",
            },
            parent_item_id: "V1",
            category_id: "Closet/Laundry/Shoe Organization",
            fulfillment_id: "F1",
            location_id: "L1",
            time: {
              label: "enable",
              timestamp: "2024-08-12T10:27:48.913Z",
            },
            quantity: {
              available: {
                count: "99",
              },
              maximum: {
                count: "99",
              },
              unitized: {
                measure: {
                  value: "1",
                  unit: "unit",
                },
              },
            },
            "@ondc/org/returnable": true,
            "@ondc/org/seller_pickup_return": false,
            "@ondc/org/return_window": "P3D",
            "@ondc/org/cancellable": true,
            "@ondc/org/time_to_ship": "P1D",
            "@ondc/org/available_on_cod": false,
            "@ondc/org/contact_details_consumer_care":
              "Dailywear Fashion,support@gmail.com,2343453434",
            "@ondc/org/statutory_reqs_packaged_commodities": {
              manufacturer_or_packer_name: "Seller Business",
              manufacturer_or_packer_address:
                "Seller Building Address, Jayanagar, Bengaluru, Karnataka, India - 560011",
              common_or_generic_name_of_commodity: "Laundry Basket",
              month_year_of_manufacture_packing_import: "NA",
            },
            tags: [
              {
                code: "origin",
                list: [
                  {
                    code: "country",
                    value: "IND",
                  },
                ],
              },
              {
                code: "attribute",
                list: [
                  {
                    code: "brand",
                    value:
                      "Polyset Elegance Plastic Laundry Basket - Assorted Colour, 53 L",
                  },
                  {
                    code: "colour",
                    value: "#964B00",
                  },
                  {
                    code: "colour_name",
                    value: "brown",
                  },
                  {
                    code: "material",
                    value: "polyethylene",
                  },
                ],
              },
            ],
          },
          {
            id: "I4",
            rating: "4",
            descriptor: {
              name: "Pigeon by Stovekraft Mini Fruit & Vegetable Chopper With 3 Blades",
              code: "3:4012789543165",
              symbol: "https://sellerNP.com/images/i1.png",
              short_desc:
                "This compact kitchen appliance is designed to help cut down your kitchen chores. A simple pull of the rope in this Pigeon Handy vegetable and fruit chopper cuts food items down into small pieces. ",
              long_desc:
                "The chopper’s tough body can withstand being put into the dishwasher. Durable design, a convenient usage made of ABS plastic, this chopper is sturdy and durable. It does not require electricity to be in use. Chop fruits and vegetables. This chopper uses its three stainless steel blades and relies on a unique string function to chop fruits and vegetables with ease. It is easy to use. Get things started by putting the blade in the Centre of the bowl. Cut vegetables or fruits to medium size before putting them into this bowl to avoid jamming the blades. Put the contents in, close the lid, and sting the rope quickly to cut food items into small pieces. Then, take the blade system out before you remove the chopped food. ",
              images: ["https://sellerNP.com/images/i1.png"],
            },
            price: {
              currency: "INR",
              value: "599.00",
              maximum_value: "1199.00",
            },
            category_id: "Kitchen Tools",
            fulfillment_id: "F1",
            location_id: "L1",
            time: {
              label: "enable",
              timestamp: "2024-08-12T10:27:48.913Z",
            },
            quantity: {
              available: {
                count: "99",
              },
              maximum: {
                count: "99",
              },
              unitized: {
                measure: {
                  value: "1",
                  unit: "unit",
                },
              },
            },
            "@ondc/org/returnable": true,
            "@ondc/org/seller_pickup_return": false,
            "@ondc/org/return_window": "P3D",
            "@ondc/org/cancellable": true,
            "@ondc/org/time_to_ship": "P1D",
            "@ondc/org/available_on_cod": false,
            "@ondc/org/contact_details_consumer_care":
              "Dailywear Fashion,support@gmail.com,2343453434",
            "@ondc/org/statutory_reqs_packaged_commodities": {
              manufacturer_or_packer_name: "Seller Business",
              manufacturer_or_packer_address:
                "Seller Building Address, Jayanagar, Bengaluru, Karnataka, India - 560011",
              common_or_generic_name_of_commodity: "Vegetable Chopper",
              month_year_of_manufacture_packing_import: "NA",
            },
            tags: [
              {
                code: "origin",
                list: [
                  {
                    code: "country",
                    value: "IND",
                  },
                ],
              },
              {
                code: "attribute",
                list: [
                  {
                    code: "brand",
                    value:
                      "Pigeon by Stovekraft Mini Fruit & Vegetable Chopper With 3 Blades ",
                  },
                  {
                    code: "colour",
                    value: "#00FF00",
                  },
                  {
                    code: "colour_name",
                    value: "green",
                  },
                  {
                    code: "material",
                    value: "polypropylene",
                  },
                ],
              },
            ],
          },
        ],
        fulfillments: [
          {
            id: "F1",
            type: "Delivery",
            contact: {
              phone: "9876543210",
              email: "test@gmail.com",
            },
          },
          {
            contact: {
              email: "home@example.com",
              phone: "7980271122",
            },
            id: "F2",
            type: "Self-Pickup",
          },
        ],
        tags: [
          {
            code: "serviceability",
            list: [
              {
                code: "location",
                value: "L1",
              },
              {
                code: "category",
                value: "Kitchen Storage and Containers",
              },
              {
                code: "type",
                value: "11",
              },
              {
                code: "unit",
                value: "pincode",
              },
              {
                code: "val",
                value: "560001-560076,560083",
              },
            ],
          },
          {
            code: "serviceability",
            list: [
              {
                code: "location",
                value: "L1",
              },
              {
                code: "category",
                value: "Stationery",
              },
              {
                code: "type",
                value: "12",
              },
              {
                code: "val",
                value: "IND",
              },
              {
                code: "unit",
                value: "country.",
              },
            ],
          },
          {
            code: "serviceability",
            list: [
              {
                code: "location",
                value: "L1",
              },
              {
                code: "category",
                value: "Closet/Laundry/Shoe Organization",
              },
              {
                code: "type",
                value: "12",
              },
              {
                code: "unit",
                value: "country",
              },
              {
                code: "val",
                value: "IND",
              },
            ],
          },
          {
            code: "serviceability",
            list: [
              {
                code: "location",
                value: "L1",
              },
              {
                code: "category",
                value: "Kitchen Tools",
              },
              {
                code: "type",
                value: "12",
              },
              {
                code: "unit",
                value: "country",
              },
              {
                code: "val",
                value: "IND",
              },
            ],
          },
          {
            code: "timing",
            list: [
              {
                code: "type",
                value: "All",
              },
              {
                code: "location",
                value: "L1",
              },
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
                value: "0000",
              },
              {
                code: "time_to",
                value: "2359",
              },
            ],
          },
          {
            code: "order_value",
            list: [
              {
                code: "min_value",
                value: "1",
              },
            ],
          },
        ],
      },
    ],
  },
};
