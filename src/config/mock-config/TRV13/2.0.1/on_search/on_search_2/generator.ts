export async function onSearch_2_Generator(
  existingPayload: any,
  sessionData: any
) {
  const now = new Date().toISOString();
  const nowPlusOneHour = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  existingPayload.message.catalog = sessionData?.on_search_1_catalog ?? {};
  existingPayload.message.catalog.providers[0].items = [
    {
      id: "Accommodation-1",
      time: {
        label: "ENABLE",
        timestamp: now,
      },
      descriptor: {
        name: "Deluxe Room",
        code: "DELUXE",
        additional_desc: {
          url: "https://remote-image-Acc-1-details.ondc.hotelbpp.com",
          content_type: "application/json",
        },
        images: [
          {
            url: "https://remote-image-Acc-1-1.ondc.hotelbpp.com",
          },
          {
            url: "https://remote-image-Acc-1-2.ondc.hotelbpp.com",
          },
        ],
      },
      price: {
        currency: "INR",
        value: "2000.00",
        maximum_value: "3000.00",
      },
      quantity: {
        available: {
          count: 12,
        },
        maximum: {
          count: 4,
        },
      },
      location_ids: ["L1"],
      category_ids: ["dlx-1234"],
      payment_ids: ["pymnt-1", "pymnt-2", "pymnt-3"],
      add_ons: [
        {
          id: "B&B",
          descriptor: {
            name: "Breakfast Included",
            short_desc: "Accommodation with breakfast included",
          },
          price: {
            currency: "INR",
            value: "200.00",
            maximum_value: "300.00",
          },
        },
        {
          id: "full-board",
          descriptor: {
            name: "Full Board",
            short_desc:
              "Accommodation with all meals included (breakfast, lunch, and dinner)",
          },
          price: {
            currency: "INR",
            value: "500.00",
            maximum_value: "700.00",
          },
        },
        {
          id: "extra-bed-child",
          descriptor: {
            name: "child bed",
            short_desc: "Accomodation with extra child bed",
          },
          price: {
            currency: "INR",
            value: "200.00",
            maximum_value: "300.00",
          },
        },
        {
          id: "extra-bed-adult",
          descriptor: {
            name: "adult bed",
            short_desc: "Accomodation with extra adult bed",
          },
          price: {
            currency: "INR",
            value: "300.00",
            maximum_value: "500.00",
          },
        },
      ],
      cancellation_terms: [
        {
          cancellation_fee: {
            percentage: "10",
          },
          cancel_by: {
            range: {
              start: new Date().toISOString(),
              end: new Date().toISOString(),
            },
          },
          cancellation_eligible: true,
        },
      ],
      recommended: true,
      tags: [
        {
          descriptor: {
            code: "INCLUSIONS",
            name: "Inclusions",
          },
          display: true,
          list: [
            {
              descriptor: {
                code: "PATIO",
              },
            },
            {
              descriptor: {
                code: "LAWN",
              },
            },
            {
              descriptor: {
                code: "GARDEN",
              },
            },
            {
              descriptor: {
                code: "PICNIC_AREA",
              },
            },
          ],
        },
        {
          descriptor: {
            code: "EXCLUSIONS",
            name: "Exclusions",
          },
          display: true,
          list: [
            {
              descriptor: {
                code: "OUTDOOR_FURNITURE",
              },
            },
            {
              descriptor: {
                code: "SUN_DECK",
              },
            },
            {
              descriptor: {
                code: "SUN_BEDS",
              },
            },
            {
              descriptor: {
                code: "BEACH_BEDS",
              },
            },
          ],
        },
      ],
    },
    {
      id: "Accommodation-2",
      time: {
        label: "ENABLE",
        timestamp: now,
        duration: "PT2H",
        range: {
          start: now,
          end: nowPlusOneHour,
        },
      },
      descriptor: {
        name: "Family Suite",
        code: "SUITE",
        additional_desc: {
          url: "https://remote-image-Acc-2-details.ondc.hotelbpp.com",
          content_type: "application/json",
        },
        images: [
          {
            url: "https://remote-image-Acc-2-1.ondc.hotelbpp.com",
          },
          {
            url: "https://remote-image-Acc-2-2.ondc.hotelbpp.com",
          },
        ],
      },
      price: {
        currency: "INR",
        value: "7000.00",
        maximum_value: "8000.00",
      },
      quantity: {
        available: {
          count: 2,
        },
        maximum: {
          count: 1,
        },
      },
      location_ids: ["L1"],
      category_ids: ["fml-ste"],
      payment_ids: ["pymnt-1"],
      add_ons: [
        {
          id: "full-board",
          descriptor: {
            name: "Full Board",
            short_desc:
              "Accommodation with all meals included (breakfast, lunch, and dinner)",
          },
          price: {
            currency: "INR",
            value: "3000.00",
            maximum_value: "4000.00",
          },
        },
      ],
      cancellation_terms: [
        {
          cancellation_fee: {
            amount: {
              currency: "INR",
              value: "100",
            },
          },
          cancel_by: {
            range: {
              start: new Date().toISOString(),
              end: new Date().toISOString(),
            },
          },
          cancellation_eligible: true,
        },
      ],
      tags: [
        {
          descriptor: {
            code: "INCLUSIONS",
            name: "Inclusions",
          },
          display: true,
          list: [
            {
              descriptor: {
                code: "PATIO",
              },
            },
            {
              descriptor: {
                code: "LAWN",
              },
            },
            {
              descriptor: {
                code: "POOLSIDE_SIT_OUT",
              },
            },
            {
              descriptor: {
                code: "RESTAURANT",
              },
            },
          ],
        },
        {
          descriptor: {
            code: "EXCLUSIONS",
            name: "Exclusions",
          },
          display: true,
          list: [
            {
              descriptor: {
                code: "BBQ_FACILITIES",
              },
            },
            {
              descriptor: {
                code: "SWIMMING_POOL",
              },
            },
            {
              descriptor: {
                code: "SUN_BEDS",
              },
            },
            {
              descriptor: {
                code: "BEACH_BEDS",
              },
            },
          ],
        },
      ],
      recommended: true,
    },
    {
      id: "Accommodation-3",
      time: {
        label: "ENABLE",
        timestamp: now,
        duration: "PT2H",
        range: {
          start: now,
          end: nowPlusOneHour,
        },
      },
      descriptor: {
        name: "Family Suite",
        code: "SUITE",
        additional_desc: {
          url: "https://remote-image-Acc-2-details.ondc.hotelbpp.com",
          content_type: "application/json",
        },
        images: [
          {
            url: "https://remote-image-Acc-2-1.ondc.hotelbpp.com",
          },
          {
            url: "https://remote-image-Acc-2-2.ondc.hotelbpp.com",
          },
        ],
      },
      price: {
        currency: "INR",
        value: "6000.00",
        maximum_value: "8000.00",
      },
      quantity: {
        available: {
          count: 2,
        },
        maximum: {
          count: 1,
        },
      },
      location_ids: ["L1"],
      category_ids: ["fml-ste"],
      payment_ids: ["pymnt-1"],
      add_ons: [
        {
          id: "full-board",
          descriptor: {
            name: "Full Board",
            short_desc:
              "Accommodation with all meals included (breakfast, lunch, and dinner)",
          },
          price: {
            currency: "INR",
            value: "3000.00",
            maximum_value: "4000.00",
          },
        },
      ],
      cancellation_terms: [
        {
          external_ref: {
            mimetype: "application/json",
            url: "https://remote-terms-ABC.ondc.hotelbpp.com",
          },
          cancellation_eligible: true,
        },
      ],
      tags: [
        {
          descriptor: {
            code: "INCLUSIONS",
            name: "Inclusions",
          },
          display: true,
          list: [
            {
              descriptor: {
                code: "PATIO",
              },
            },
            {
              descriptor: {
                code: "LAWN",
              },
            },
            {
              descriptor: {
                code: "POOLSIDE_SIT_OUT",
              },
            },
            {
              descriptor: {
                code: "RESTAURANT",
              },
            },
          ],
        },
        {
          descriptor: {
            code: "EXCLUSIONS",
            name: "Exclusions",
          },
          display: true,
          list: [
            {
              descriptor: {
                code: "BBQ_FACILITIES",
              },
            },
            {
              descriptor: {
                code: "SWIMMING_POOL",
              },
            },
            {
              descriptor: {
                code: "SUN_BEDS",
              },
            },
            {
              descriptor: {
                code: "BEACH_BEDS",
              },
            },
          ],
        },
      ],
      recommended: true,
    },
  ];

  existingPayload.message.catalog.providers[0].tags = [
    {
      descriptor: {
        code: "INCLUSIONS",
        name: "Inclusions",
      },
      display: true,
      list: [
        {
          descriptor: {
            code: "FREE_TOILETRIES",
          },
        },
        {
          descriptor: {
            code: "IRONING_FACILITIES",
          },
        },
        {
          descriptor: {
            code: "LAN",
          },
        },
        {
          descriptor: {
            code: "HAIR_DRYER",
          },
        },
      ],
    },
    {
      descriptor: {
        code: "EXCLUSIONS",
        name: "Exclusions",
      },
      display: true,
      list: [
        {
          descriptor: {
            code: "MICROWAVE",
          },
        },
        {
          descriptor: {
            code: "REFRIGERATOR",
          },
        },
        {
          descriptor: {
            code: "WASHING_MACHINE",
          },
        },
        {
          descriptor: {
            code: "COOKING_APPLIANCES",
          },
        },
      ],
    },
  ];

  // if (sessionData?.on_search_1_tags) {
  //   console.log("on_search_1_tags", sessionData.on_search_1_tags);
  //   existingPayload.message.catalog.tags = sessionData.on_search_1_tags.flat() ?? [];
  //   if (existingPayload.message.catalog.tags[0]?.list) {
  //     existingPayload.message.catalog.tags[0].list.push({
  //       descriptor: {
  //         code: "CURRENT_PAGE_NUMBER",
  //       },
  //       value: "1",
  //     });
  //   }
  // }

  // Use lodash cloneDeep (better than JSON.parse(JSON.stringify))
  // existingPayload.message.catalog = sessionData?.on_search_1_catalog
  //   ? cloneDeep(sessionData.on_search_1_catalog)
  //   : {};

  return existingPayload;
}
