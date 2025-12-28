import { v4 as uuidv4 } from "uuid";
import { SessionData, Input } from "../../../session-types";
import {
  mergeFulfillmentTags,
  removeTagsByCodes,
  TatMapping,
} from "../../../../../../utils/generic-utils";

export const confirmGenerator = (
  existingPayload: any,
  sessionData: SessionData,
  inputs: Input | undefined,
  action_id: string
) => {
  existingPayload.message.order.id = uuidv4();

  existingPayload.message.order.provider.id = sessionData.provider_id;
  // existingPayload.message.order.provider.locations[0].id =
  //   sessionData.location_id;

  if (sessionData?.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  existingPayload.message.order.items = sessionData.items;

  let time: any = null;

  sessionData?.on_search_items?.forEach((item: any) => {
    // console.log("::::::::::::", item.id, existingPayload.message.order.items[0].id, item)
    if (item.id === existingPayload.message.order.items[0].id) {
      time = item.time;
    }
  });

  existingPayload.message.order.items = existingPayload.message.order.items.map(
    (item: any) => {
      item.time = time;
      return item;
    }
  );

  if (sessionData?.rate_basis) {
    existingPayload.message.order.items =
      existingPayload.message.order.items.map((item: any) => {
        delete item.fulfillment_id;
        let fulfiillmentIds: any[] = [];

        sessionData?.on_init_items?.forEach((oninitItem) => {
          if (oninitItem.id === item.id) {
            fulfiillmentIds = oninitItem.fulfillment_ids;
          }
        });

        item.fulfillment_ids = fulfiillmentIds;
        return item;
      });
  }

  if (sessionData.fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
    console.log("existing payload in confirm", JSON.stringify(existingPayload.message.order.fulfillments));

  }

  if (
    Array.isArray(sessionData.cancellation_terms) &&
    sessionData.cancellation_terms.length > 0
  ) {
    existingPayload.message.order.cancellation_terms =
      sessionData.cancellation_terms;
  }
  existingPayload.message.order.fulfillments[0].start.time = {
    duration: action_id === "confirm_REVERSE_QC_LOGISTICS" ? sessionData.on_search_return_fulfillment.start.time.duration : sessionData.on_search_fulfillment.start.time.duration,
  };

  existingPayload.message.order.fulfillments[0].start.person = {
    name: "person_name_1",
  };

  existingPayload.message.order.fulfillments[0].end.person = {
    name: "person_name_2",
  };

  // const tags = [
  //   {
  //     code: "linked_order",
  //     list: [
  //       ...(sessionData?.is_cod === "yes"
  //         ? [
  //             { code: "cod_order", value: "yes" },
  //             { code: "collection_amount", value: "300.00" },
  //           ]
  //         : []),
  //       {
  //         code: "id",
  //         value: "RO1",
  //       },
  //       ...(sessionData?.category_id === "Immediate Delivery"
  //         ? [
  //             {
  //               code: "prep_time",
  //               value:
  //                 TatMapping[sessionData?.category_id].orderPrepTime || "PT30M",
  //             },
  //           ]
  //         : []),
  //       {
  //         code: "currency",
  //         value: "INR",
  //       },
  //       {
  //         code: "declared_value",
  //         value: "300.0",
  //       },
  //       {
  //         code: "weight_unit",
  //         value: "kilogram",
  //       },
  //       {
  //         code: "weight_value",
  //         value: "3.0",
  //       },
  //       {
  //         code: "dim_unit",
  //         value: "centimeter",
  //       },
  //       {
  //         code: "length",
  //         value: "1.0",
  //       },
  //       {
  //         code: "breadth",
  //         value: "1.0",
  //       },
  //       {
  //         code: "height",
  //         value: "1.0",
  //       },
  //       ...(sessionData?.domain === "ONDC:LOG11"
  //         ? [
  //             {
  //               code: "shipment_type",
  //               value: "box",
  //             },
  //           ]
  //         : []),
  //     ],
  //   },
  //   {
  //     code: "linked_order_item",
  //     list: [
  //       {
  //         code: "category",
  //         value: sessionData?.retail_category || "Grocery",
  //       },
  //       {
  //         code: "name",
  //         value: "Item1",
  //       },
  //       {
  //         code: "currency",
  //         value: "INR",
  //       },
  //       {
  //         code: "value",
  //         value: "70.0",
  //       },
  //       {
  //         code: "quantity",
  //         value: "2",
  //       },
  //       {
  //         code: "weight_unit",
  //         value: "kilogram",
  //       },
  //       {
  //         code: "weight_value",
  //         value: "1.0",
  //       },
  //     ],
  //   },
  //   {
  //     code: "linked_order_item",
  //     list: [
  //       {
  //         code: "category",
  //         value: sessionData?.retail_category || "Grocery",
  //       },
  //       {
  //         code: "name",
  //         value: "Item2",
  //       },
  //       {
  //         code: "currency",
  //         value: "INR",
  //       },
  //       {
  //         code: "value",
  //         value: "160.0",
  //       },
  //       {
  //         code: "quantity",
  //         value: "1",
  //       },
  //       {
  //         code: "weight_unit",
  //         value: "kilogram",
  //       },
  //       {
  //         code: "weight_value",
  //         value: "1.0",
  //       },
  //     ],
  //   },
  //   {
  //     code: "state",
  //     list: [
  //       {
  //         code: "ready_to_ship",
  //         value:
  //           sessionData.category_id === "Immediate Delivery" ? "yes" : "no",
  //       },
  //     ],
  //   },
  //   ...(sessionData?.domain === "ONDC:LOG10"
  //     ? [
  //         {
  //           code: "rto_action",
  //           list: [
  //             {
  //               code: "return_to_origin",
  //               value: inputs?.returnToOrigin || "no",
  //             },
  //           ],
  //         },
  //       ]
  //     : []),
  //   ...(sessionData?.domain === "ONDC:LOG11"
  //     ? [
  //         {
  //           code: "rto_action",
  //           list: [
  //             {
  //               code: "return_to_origin",
  //               value: inputs?.returnToOrigin || "yes",
  //             },
  //           ],
  //         },
  //       ]
  //     : []),
  //   ...(sessionData?.is_cod === "yes"
  //     ? [
  //         {
  //           code: "cod_settlement_detail",
  //           list: [
  //             {
  //               code: "settlement_window",
  //               value: "P0D",
  //             },
  //             {
  //               code: "settlement_type",
  //               value: "neft",
  //             },
  //             {
  //               code: "beneficiary_name",
  //               value: "XXXXXXXXXX",
  //             },
  //             {
  //               code: "upi_address",
  //               value: "",
  //             },
  //             {
  //               code: "bank_account_no",
  //               value: "XXXXXXXXXX",
  //             },
  //             {
  //               code: "ifsc_code",
  //               value: "XXXXXXXXX",
  //             },
  //             {
  //               code: "bank_name",
  //               value: "xxxx",
  //             },
  //             {
  //               code: "branch_name",
  //               value: "xxxx",
  //             },
  //           ],
  //         },
  //       ]
  //     : []),
  // ];

  // const tags = [
  //   {
  //     code: "linked_order",
  //     list: [
  //       ...(sessionData?.is_cod === "yes"
  //         ? [
  //           { code: "cod_order", value: "yes" },
  //           { code: "collection_amount", value: "300.00" },
  //         ]
  //         : []),
  //       { code: "id", value: "RO1" },
  //       ...(sessionData?.category_id === "Immediate Delivery"
  //         ? [
  //           {
  //             code: "prep_time",
  //             value:
  //               TatMapping[sessionData?.category_id].orderPrepTime || "PT30M",
  //           },
  //         ]
  //         : []),
  //       { code: "currency", value: "INR" },
  //       { code: "declared_value", value: "300.0" },
  //       { code: "weight_unit", value: "kilogram" },
  //       { code: "weight_value", value: "3.0" },
  //       { code: "dim_unit", value: "centimeter" },
  //       { code: "length", value: "1.0" },
  //       { code: "breadth", value: "1.0" },
  //       { code: "height", value: "1.0" },
  //       ...(sessionData?.domain === "ONDC:LOG11"
  //         ? [{ code: "shipment_type", value: "box" }]
  //         : []),
  //     ],
  //   },

  //   // Dynamically create linked_order_item for each item
  //   ...(sessionData?.on_search_items ?? []).map((item: any) => {
  //     const baseList = [
  //       { code: "category", value: sessionData?.retail_category || "Grocery" },
  //       { code: "name", value: "item1" },
  //       { code: "currency", value: "INR" },
  //       { code: "value", value: item.value?.toString() || "0.0" },
  //       { code: "quantity", value: "2" },
  //       { code: "weight_unit", value: "kilogram" },
  //       { code: "weight_value", value: "1.0" },
  //     ];

  //     // Only add hsn_code if condition matches
  //     if (
  //       action_id === "confirm_E_WAY_BILL_LOGISTICS"
  //     ) {
  //       baseList.push(
  //         { code: "hsn_code", value: "1:2345" },
  //         { code: "ebn_exempt", value: item.ebn_exempt || "no" }
  //       );
  //     }

  //     return { code: "linked_order_item", list: baseList };
  //   }),

  //   {
  //     code: "state",
  //     list: [
  //       {
  //         code: "ready_to_ship",
  //         value: sessionData.category_id === "Immediate Delivery" ? "yes" : "no",
  //       },
  //     ],
  //   },

  //   ...(sessionData?.domain === "ONDC:LOG10"
  //     ? [
  //       {
  //         code: "rto_action",
  //         list: [
  //           { code: "return_to_origin", value: inputs?.returnToOrigin || "no" },
  //         ],
  //       },
  //     ]
  //     : []),

  //   ...(sessionData?.domain === "ONDC:LOG11"
  //     ? [
  //       {
  //         code: "rto_action",
  //         list: [
  //           { code: "return_to_origin", value: inputs?.returnToOrigin || "yes" },
  //         ],
  //       },
  //     ]
  //     : []),

  //   ...(sessionData?.is_cod === "yes"
  //     ? [
  //       {
  //         code: "cod_settlement_detail",
  //         list: [
  //           { code: "settlement_window", value: "P0D" },
  //           { code: "settlement_type", value: "neft" },
  //           { code: "beneficiary_name", value: "XXXXXXXXXX" },
  //           { code: "upi_address", value: "" },
  //           { code: "bank_account_no", value: "XXXXXXXXXX" },
  //           { code: "ifsc_code", value: "XXXXXXXXX" },
  //           { code: "bank_name", value: "xxxx" },
  //           { code: "branch_name", value: "xxxx" },
  //         ],
  //       },
  //     ]
  //     : []),
  // ];

  // let allTags = [...tags];

  const linked_provider = existingPayload.message.order.fulfillments[0]?.tags.find((tag: any) => tag.code === "linked_provider")

  const tags = [
    {
      code: "linked_order",
      list: [
        ...(sessionData?.is_cod === "yes"
          ? [
            { code: "cod_order", value: "yes" },
            { code: "collection_amount", value: "300.00" },
          ]
          : []),
        { code: "id", value: "RO1" },
        ...(sessionData?.category_id === "Immediate Delivery"
          ? [
            {
              code: "prep_time",
              value:
                TatMapping[sessionData?.category_id]?.orderPrepTime || "PT30M",
            },
          ]
          : []),
        { code: "currency", value: "INR" },
        { code: "declared_value", value: "300.0" },
        { code: "weight_unit", value: "kilogram" },
        { code: "weight_value", value: "3.0" },
        { code: "dim_unit", value: "centimeter" },
        { code: "length", value: "1.0" },
        { code: "breadth", value: "1.0" },
        { code: "height", value: "1.0" },
        ...(sessionData?.domain === "ONDC:LOG11"
          ? [{ code: "shipment_type", value: "box" }]
          : []),
      ],
    },

    // --------------------
    // KEEP THIS LOGIC AS IS (linked_order_item)
    // --------------------
    ...(sessionData?.on_search_items ?? []).map((item: any) => {
      const baseList = [
        { code: "category", value: sessionData?.retail_category || "Grocery" },
        { code: "name", value: "item1" },
        { code: "currency", value: "INR" },
        { code: "value", value: item.value?.toString() || "0.0" },
        { code: "quantity", value: "2" },
        { code: "weight_unit", value: "kilogram" },
        { code: "weight_value", value: "1.0" },
      ];

      if (action_id === "confirm_E_WAY_BILL_LOGISTICS") {
        baseList.push(
          { code: "hsn_code", value: "1:2345" },
          { code: "ebn_exempt", value: item.ebn_exempt || "no" }
        );
      }

      return { code: "linked_order_item", list: baseList };
    }),

    {
      code: "state",
      list: [
        {
          code: "ready_to_ship",
          value:
            sessionData?.category_id === "Immediate Delivery" ? "yes" : "no",
        },
      ],
    },

    ...(sessionData?.domain === "ONDC:LOG10"
      ? [
        {
          code: "rto_action",
          list: [
            {
              code: "return_to_origin",
              value: inputs?.returnToOrigin || "no",
            },
          ],
        },
      ]
      : []),

    ...(sessionData?.domain === "ONDC:LOG11"
      ? [
        {
          code: "rto_action",
          list: [
            {
              code: "return_to_origin",
              value: inputs?.returnToOrigin || "yes",
            },
          ],
        },
      ]
      : []),

    ...(sessionData?.is_cod === "yes"
      ? [
        {
          code: "cod_settlement_detail",
          list: [
            { code: "settlement_window", value: "P0D" },
            { code: "settlement_type", value: "neft" },
            { code: "beneficiary_name", value: "XXXXXXXXXX" },
            { code: "upi_address", value: "" },
            { code: "bank_account_no", value: "XXXXXXXXXX" },
            { code: "ifsc_code", value: "XXXXXXXXX" },
            { code: "bank_name", value: "xxxx" },
            { code: "branch_name", value: "xxxx" },
          ],
        },
      ]
      : []),
  ];


  let allTags: any[] = mergeFulfillmentTags(
    existingPayload.message.order.fulfillments[0]?.tags ?? [],
    tags
  );


  if (
    sessionData?.rate_basis &&
    existingPayload.message.order.fulfillments.length > 1
  ) {
    const preTags = removeTagsByCodes(
      existingPayload.message.order.fulfillments[1].tags ?? [],
      ["linked_provider"]
    );

    allTags = [...allTags, ...preTags];
  }

  allTags = removeTagsByCodes(allTags, ["rider_check"]);

  existingPayload.message.order.fulfillments =
    existingPayload.message.order.fulfillments.map((fulfillment: any) => ({
      ...fulfillment,
      tags: allTags,
    }));

  // --------------------
  let isReadyToShip = false;

  existingPayload.message.order.fulfillments[0].tags.forEach((tag: any) => {
    if (tag.code === "state") {
      tag.list.forEach((item: any) => {
        if (item.code === "ready_to_ship" && item.value == "yes") {
          isReadyToShip = true;
        }
      });
    }
  });

  existingPayload.message.order.fulfillments =
    existingPayload.message.order.fulfillments.map(
      (fulfillment: {
        type: string
        start: { instructions: any };
        end: { instructions: any };
        tags: any[];
      }) => {
        const startCode = sessionData?.static_pickup_otp;
        const endCode = sessionData?.static_delivery_otp;

        let updatedStartInstructions;
        let updatedEndInstructions;

        // ✅ Case 1: Explicit seller & buyer instructions
        if (action_id === "confirm_SELLER_BUYER_INSTRUCTIONS") {
          updatedStartInstructions = {
            code: "2",
            short_desc: "123123",
            long_desc: "additional instructions for pickup e.g. register or counter no",
            additional_desc: {
              content_type: "text/html",
              url: "http://pickup-info.com",
            },
          };

          updatedEndInstructions = {
            code: "2",
            short_desc: "987657",
            long_desc: "additional instructions for delivery e.g. leave package outside door",
            additional_desc: {
              content_type: "text/html",
              url: "http://delivery-info.com",
            },
          };
        }
        else if (fulfillment?.type === "FTL" || fulfillment.type === "PTL") {
          updatedStartInstructions = {
            "code": "2",
            "short_desc": "value of PCC",
            "long_desc": "additional instructions for pickup",
          }
          updatedEndInstructions =   {
              "code": "3",
              "short_desc": "value of DCC",
              "long_desc": "additional instructions for delivery",
             }


        }
        // ✅ Case 2: OTP / RTO based logic
        else {
          updatedStartInstructions =
            startCode === "5"
              ? {
                code: "5",
                short_desc: "9870", // static OTP for pickup
                long_desc: "additional instructions for pickup",
                additional_desc: {
                  content_type: "text/html",
                  url: "http://description.com",
                },
              }
              : isReadyToShip
                ? {
                  code: "2",
                  short_desc: "123123",
                  long_desc: "additional instructions for pickup",
                  additional_desc: {
                    content_type: "text/html",
                    url: "http://description.com",
                  },
                }
                : undefined;

          updatedEndInstructions =
            endCode === "5"
              ? {
                code: "5",
                short_desc: "6871", // static OTP for delivery
                long_desc: "additional instructions for delivery",
                additional_desc: {
                  content_type: "text/html",
                  url: "http://description.com",
                },
              }
              : isReadyToShip
                ? {
                  code: "2",
                  short_desc: "987657",
                  long_desc: "additional instructions for delivery",
                  additional_desc: {
                    content_type: "text/html",
                    url: "http://description.com",
                  },
                }
                : undefined;
        }

        // ✅ RTO tag extraction
        const rtoTag = fulfillment.tags.find(
          (tag: { code: string }) => tag.code === "rto_action"
        );
        const rtoAction = rtoTag?.list?.find(
          (item: { code: string }) => item.code === "return_to_origin"
        )?.value;
        console.log("inputs", inputs);

        const reverseQCTagsObj = {
          "code": "reverseqc_input",
          "list":
            [
              {
                "code": "P001",
                "value": `${inputs?.item}`
              },
              {
                "code": "P003",
                "value": "1"
              },
              {
                "code": "Q001",
                "value": ""
              }
            ]
        }

        const linkedProviderTag =
          action_id === "confirm_LOGISTICS_SELLER_CREDS"
            ? {
              code: "linked_provider",
              list: [
                { code: "id", value: "P1" },
                { code: "name", value: "Seller1" },
                { code: "cred_code", value: "Social Sector" },
                { code: "cred_desc", value: "Women owned business" },
              ],
            }
            : {
              code: "linked_provider",
              list: [
                { code: "id", value: sessionData.provider_id },
                { code: "name", value: "Seller1" },
                {
                  code: "address",
                  value: `My store name 1, My building name 1, My street name 1, my city 1, my state 1, ${sessionData?.start_area_code || "560001"
                    }`,
                },
                ...(sessionData.domain === "ONDC:LOG11"
                  ? [{ code: "tax_id", value: "29GSTIN1234K2Z2" }]
                  : []),
              ],
            };



        const additionaltags = [
          ...(fulfillment.tags ?? []).filter(
            (tag: any) => tag.code !== "linked_provider"
          ),
          linkedProviderTag,

          // optional rto_verification
          ...(endCode === "5" && rtoAction === "yes"
            ? [
              {
                code: "rto_verification",
                list: [
                  { code: "code", value: "5" },
                  { code: "short_desc", value: "1841" },
                ],
              },
            ]
            : []),
        ];


        if (action_id === "confirm_REVERSE_QC_LOGISTICS") additionaltags.push(reverseQCTagsObj)

        // ✅ Final updated fulfillment
        const updatedFulfillment = {
          ...fulfillment,
          start: {
            ...fulfillment.start,
            instructions: updatedStartInstructions,
          },
          end: {
            ...fulfillment.end,
            instructions: updatedEndInstructions,
          },
          tags: additionaltags,
        };

        console.log("Updated fulfillment:", updatedFulfillment);
        return updatedFulfillment;
      }
    );


  console.log("All fulfillments updated successfully.");

  const tempQuote = sessionData.quote;

  delete tempQuote.ttl;

  existingPayload.message.order.quote = tempQuote;

  existingPayload.message.order.created_at = existingPayload.context.timestamp;
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;

  if (sessionData.payment) {
    existingPayload.message.order.payment = sessionData.payment;
  }

  if (
    (sessionData.payment_type === "POST-FULFILLMENT" ||
      sessionData.payment_type === "ON-FULFILLMENT") &&
    existingPayload.message.order.payment.collected_by === "BPP"
  ) {
    existingPayload.message.order.payment["@ondc/org/settlement_details"] = [
      {
        settlement_counterparty: "lbnp",
        settlement_type: "upi",
        beneficiary_name: "xxxxx",
        upi_address: "gft@oksbi",
        settlement_bank_account_no: "XXXXXXXXXX",
        settlement_ifsc_code: "XXXXXXXXX",
      },
    ];
  }

  existingPayload.message.order["@ondc/org/linked_order"] = {
    items: [
      {
        category_id: sessionData?.retail_category || "Grocery",
        descriptor: {
          name: "Item1",
        },
        quantity: {
          count: 2,
          measure: {
            unit: "kilogram",
            value: 1,
          },
        },
        price: {
          currency: "INR",
          value: "70.00",
        },
      },
      {
        category_id: sessionData?.retail_category || "Grocery",
        descriptor: {
          name: "Item2",
        },
        quantity: {
          count: 1,
          measure: {
            unit: "kilogram",
            value: 1,
          },
        },
        price: {
          currency: "INR",
          value: "160.00",
        },
      },
    ],
    provider: {
      descriptor: {
        name: "Seller1",
      },
      address: {
        name: "My store name 1",
        building: "My building name 1",
        locality: "My street name 1",
        city: "my city 1",
        state: "my state 1",
        area_code: sessionData?.start_area_code || "560001",
      },
    },
    order: {
      id: "O1",
      weight: {
        unit: "kilogram",
        value: 3,
      },
      dimensions: {
        length: {
          unit: "centimeter",
          value: 1,
        },
        breadth: {
          unit: "centimeter",
          value: 1,
        },
        height: {
          unit: "centimeter",
          value: 1,
        },
      },
    },
  };
  if (
    sessionData.insurance_required === "yes" &&
    sessionData.insurance_owner === "lbnp"
  ) {
    const fulfillment = existingPayload.message.order.fulfillments[0];
    console.log("fulfillment.tags", JSON.stringify(fulfillment.tags));


    const specialReqTag = fulfillment.tags?.find(
      (tag: any) => tag.code === "special_req"
    );

    if (specialReqTag) {
      // Ensure list exists
      specialReqTag.list = specialReqTag.list || [];
      console.log("specialReqTag.list", specialReqTag.list);


      specialReqTag.list.push(
        { code: "insurance_amount", value: "100000" },
        { code: "insurer_name", value: "ICICI Lombard" }
      );
    }
  }
  if (action_id === "confirm_LOGISTICS_EXCHANGE") {
    const orderTags: any = existingPayload.message.order?.tags || [];
    const newEntry = { code: "phone", value: "9886098861" };
    let bapTerms = orderTags.find((tag: any) => tag.code === "bap_terms");
    if (!bapTerms) {
      bapTerms = { code: "bap_terms", list: [] };
      orderTags.push(bapTerms);
    }
    bapTerms.list.push(newEntry);
  }
  if (action_id === "confirm_LOGISTICS_SLA") {
    existingPayload.message.order.tags.push(
      ...[
        {
          code: "lbnp_sla_terms",
          list: [
            {
              code: "metric",
              value: "Order_Accept",
            },
            {
              code: "base_unit",
              value: "mins",
            },
            {
              code: "base_min",
              value: "0",
            },
            {
              code: "base_max",
              value: "2",
            },
            {
              code: "penalty_min",
              value: "20",
            },
            {
              code: "penalty_max",
              value: "29.9",
            },
            {
              code: "penalty_unit",
              value: "percent",
            },
            {
              code: "penalty_value",
              value: "0.5",
            },
          ],
        },
        {
          code: "lbnp_sla_terms",
          list: [
            {
              code: "metric",
              value: "Order_Accept",
            },
            {
              code: "base_unit",
              value: "mins",
            },
            {
              code: "base_min",
              value: "0",
            },
            {
              code: "base_max",
              value: "2",
            },
            {
              code: "penalty_min",
              value: "30",
            },
            {
              code: "penalty_max",
              value: "",
            },
            {
              code: "penalty_unit",
              value: "percent",
            },
            {
              code: "penalty_value",
              value: "1",
            },
          ],
        },
      ]
    );
  }
  if (action_id === "confirm_B2B_LOGISTICS") {
    delete existingPayload.message.order.payment
  }
  return existingPayload;
};
