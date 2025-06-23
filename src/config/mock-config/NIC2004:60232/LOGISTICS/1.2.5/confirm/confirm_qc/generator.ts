import { v4 as uuidv4 } from "uuid";
import { SessionData, Input } from "../../../../session-types";
import { removeTagsByCodes } from "../../../../../../../utils/generic-utils";

export const confirmQCGenerator = (
  existingPayload: any,
  sessionData: SessionData,
  inputs: Input | undefined
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
  }

  if (
    Array.isArray(sessionData.cancellation_terms) &&
    sessionData.cancellation_terms.length > 0
  ) {
    existingPayload.message.order.cancellation_terms =
      sessionData.cancellation_terms;
  }
  for (let i = 0; i < existingPayload.message.order.fulfillments.length; i++) {
    existingPayload.message.order.fulfillments[i].start = {
      time: {
        duration: sessionData.on_search_fulfillment.start.time.duration,
      },
      person: {
        name: `person_name_1`,
      },
    };
  }

  // existingPayload.message.order.fulfillments[0].end.person = {
  //   name: "person_name_2",
  // };

  const tags = [
    ...(!sessionData?.rate_basis
      ? [
          {
            code: "linked_provider",
            list: [
              {
                code: "id",
                value: sessionData.provider_id,
              },
              {
                code: "name",
                value: "Seller1",
              },
              {
                code: "address",
                value: `My store name 1, My building name 1, My street name 1, my city 1, my state 1, ${
                  sessionData?.start_area_code || "560001"
                }`,
              },
              ...(sessionData.domain === "ONDC:LOG11"
                ? [
                    {
                      code: "tax_id",
                      value: "29GSTIN1234K2Z2",
                    },
                  ]
                : []),
            ],
          },
          {
            code: "linked_order",
            list: [
              ...(sessionData?.is_cod === "yes"
                ? [
                    { code: "cod_order", value: "yes" },
                    { code: "collection_amount", value: "300.00" },
                  ]
                : []),
              {
                code: "id",
                value: "RO1",
              },
              {
                code: "currency",
                value: "INR",
              },
              {
                code: "declared_value",
                value: "300.0",
              },
              {
                code: "weight_unit",
                value: "kilogram",
              },
              {
                code: "weight_value",
                value: "3.0",
              },
              {
                code: "dim_unit",
                value: "centimeter",
              },
              {
                code: "length",
                value: "1.0",
              },
              {
                code: "breadth",
                value: "1.0",
              },
              {
                code: "height",
                value: "1.0",
              },
              ...(sessionData?.domain === "ONDC:LOG11"
                ? [
                    {
                      code: "shipment_type",
                      value: "box",
                    },
                  ]
                : []),
            ],
          },
          {
            code: "linked_order_item",
            list: [
              {
                code: "category",
                value: sessionData?.retail_category || "Grocery",
              },
              {
                code: "name",
                value: "Item1",
              },
              {
                code: "currency",
                value: "INR",
              },
              {
                code: "value",
                value: "70.0",
              },
              {
                code: "quantity",
                value: "2",
              },
              {
                code: "weight_unit",
                value: "kilogram",
              },
              {
                code: "weight_value",
                value: "1.0",
              },
            ],
          },
          {
            code: "linked_order_item",
            list: [
              {
                code: "category",
                value: sessionData?.retail_category || "Grocery",
              },
              {
                code: "name",
                value: "Item2",
              },
              {
                code: "currency",
                value: "INR",
              },
              {
                code: "value",
                value: "160.0",
              },
              {
                code: "quantity",
                value: "1",
              },
              {
                code: "weight_unit",
                value: "kilogram",
              },
              {
                code: "weight_value",
                value: "1.0",
              },
            ],
          },
        ]
      : []),
    {
      code: "state",
      list: [
        {
          code: "ready_to_ship",
          value:
            sessionData.category_id === "Immediate Delivery" ? "yes" : "no",
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
              {
                code: "settlement_window",
                value: "P0D",
              },
              {
                code: "settlement_type",
                value: "neft",
              },
              {
                code: "beneficiary_name",
                value: "XXXXXXXXXX",
              },
              {
                code: "upi_address",
                value: "",
              },
              {
                code: "bank_account_no",
                value: "XXXXXXXXXX",
              },
              {
                code: "ifsc_code",
                value: "XXXXXXXXX",
              },
              {
                code: "bank_name",
                value: "xxxx",
              },
              {
                code: "branch_name",
                value: "xxxx",
              },
            ],
          },
        ]
      : []),
  ];

  let allTags = tags;

  if (sessionData.rate_basis) {
    const preTags = removeTagsByCodes(
      existingPayload.message.order.fulfillments[1].tags,
      ["linked_provider"]
    );

    allTags = [...allTags, ...preTags];
  }

  allTags = removeTagsByCodes(allTags, ["rider_check"]);

  existingPayload.message.order.fulfillments =
    existingPayload.message.order.fulfillments.map((fulfillment: any) => {
      fulfillment.tags = allTags;
      return fulfillment;
    });
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
        start: { instructions: { code: any } };
        end: { instructions: { code: any } };
        tags: any;
      }) => {
        const startCode = fulfillment?.start?.instructions?.code;
        const endCode = fulfillment?.end?.instructions?.code;

        console.log("Original start code:", startCode);
        console.log("Original end code:", endCode);

        const updatedStartInstructions =
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

        const updatedEndInstructions =
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

        console.log("Updated start instructions:", updatedStartInstructions);
        console.log("Updated end instructions:", updatedEndInstructions);
        const rtoTag = fulfillment.tags.find(
          (tag: { code: string }) => tag.code === "rto_action"
        );
        const rtoAction = rtoTag?.list?.find(
          (item: { code: string }) => item.code === "return_to_origin"
        )?.value;
        console.log("RTOaCTION", rtoAction);
        console.log("endCode", endCode);
        console.log("Condition:", endCode === "5" && rtoAction === "yes");
        console.log(typeof endCode, endCode); // Should log: string 5
        console.log(typeof rtoAction, rtoAction); // Should log: string yes

        const additionaltags = [
          ...fulfillment.tags,
          ...(endCode === "5" && rtoAction === "yes"
            ? [
                {
                  code: "rto_verification",
                  list: [
                    {
                      code: "code",
                      value: "5",
                    },
                    {
                      code: "short_desc",
                      value: "1841",
                    },
                  ],
                },
              ]
            : []),
        ];
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

  return existingPayload;
};
