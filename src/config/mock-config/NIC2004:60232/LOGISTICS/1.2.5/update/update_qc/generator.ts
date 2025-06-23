import { SessionData } from "../../../../session-types";
import { removeTagsByCodes } from "../../../../../../../utils/generic-utils";

export async function updateQCGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.message.order.id = sessionData.order_id;

  existingPayload.message.order.items = sessionData.items.map(
    (item: { id: any; category_id: any }) => ({
      id: item.id,
      category_id: item.category_id,
    })
  );

  if (sessionData?.fulfillments) {
    // Extract all rider_details from fulfillments of type "Batch"
    const riderDetailsTags = sessionData.fulfillments
      .filter((fulfillment) => fulfillment.type === "Batch")
      .flatMap(
        (fulfillment) =>
          fulfillment.tags?.filter(
            (tag: { code: string }) => tag.code === "rider_details"
          ) || []
      );

    let riderIndex = 0;

    existingPayload.message.order.fulfillments = sessionData.fulfillments.map(
      (fulfillment: any) => {
        // Add rider_details tag to each "Delivery" type fulfillment
        if (
          fulfillment.type === "Delivery" &&
          riderIndex < riderDetailsTags.length
        ) {
          const rider = riderDetailsTags[riderIndex]?.list || [];
          const name =
            rider.find((r: { code: string }) => r.code === "name")?.value ?? "";
          const phone =
            rider.find((r: { code: string }) => r.code === "phone")?.value ??
            "";

          fulfillment.agent = {
            name,
            phone,
          };
          fulfillment.end = {
            ...fulfillment.end,
            location: {
              gps: `12.453${riderIndex + 1},77.928${riderIndex + 1}`,
              address: {
                name: `My house #${riderIndex + 1}`,
                building: "My house or building name",
                locality: "My street name",
                city: "Bengaluru",
                state: "Karnataka",
                country: "India",
                area_code: sessionData.end_area_code || "560001", 
              },
            },
            contact: {
              phone,
              email: `rider${riderIndex + 1}@example.com`,
            },
          };
          riderIndex++;

          // Update start instructions only if code is NOT "5"
          if (fulfillment?.start?.instructions?.code !== "5") {
            fulfillment.start = {
              ...fulfillment.start,
              instructions: {
                code: "2",
                short_desc: "123123",
                long_desc: "additional instructions for pickup",
                additional_desc: {
                  content_type: "text/html",
                  url: "http://description.com",
                },
              },
            };
          }

          // Update end instructions only if code is NOT "5"
          if (fulfillment?.end?.instructions?.code !== "5") {
    
            fulfillment.end = {
              ...fulfillment.end,
              instructions: {
                code: "2",
                short_desc: "987657",
                long_desc: "additional instructions for delivery",
                additional_desc: {
                  content_type: "text/html",
                  url: "http://description.com",
                },
              },
            };
          }

          // Update tags
          let preTags = removeTagsByCodes(fulfillment.tags || [], [
            "weather_check",
            "rto_action",
            "cod_settlement_detail",
            "state",
            "fulfill_request",
            "fulfill_response",
          ]);

          preTags = [
            ...preTags,
            {
              code: "linked_provider",
              list: [
                { code: "id", value: sessionData.provider_id ?? "" },
                { code: "name", value: "Seller1" },
                {
                  code: "address",
                  value: `My store name 1, My building name 1, My street name 1, my city 1, my state 1, ${
                    sessionData?.start_area_code ?? "560001"
                  }`,
                },
              ],
            },
            {
              code: "linked_order",
              list: [
                { code: "id", value: "RO1" },
                { code: "currency", value: "INR" },
                { code: "declared_value", value: "300.0" },
                { code: "weight_unit", value: "kilogram" },
                { code: "weight_value", value: "3.0" },
                { code: "dim_unit", value: "centimeter" },
                { code: "length", value: "1.0" },
                { code: "breadth", value: "1.0" },
                { code: "height", value: "1.0" },
              ],
            },
            {
              code: "linked_order_item",
              list: [
                {
                  code: "category",
                  value: sessionData?.retail_category ?? "Grocery",
                },
                { code: "name", value: "Item1" },
                { code: "currency", value: "INR" },
                { code: "value", value: "70.0" },
                { code: "quantity", value: "2" },
                { code: "weight_unit", value: "kilogram" },
                { code: "weight_value", value: "1.0" },
              ],
            },
            {
              code: "linked_order_item",
              list: [
                {
                  code: "category",
                  value: sessionData?.retail_category ?? "Grocery",
                },
                { code: "name", value: "Item2" },
                { code: "currency", value: "INR" },
                { code: "value", value: "160.0" },
                { code: "quantity", value: "1" },
                { code: "weight_unit", value: "kilogram" },
                { code: "weight_value", value: "1.0" },
              ],
            },
            {
              code: "state",
              list: [
                { code: "ready_to_ship", value: "yes" },
                ...(sessionData.category_id === "Immediate Delivery"
                  ? [{ code: "order_ready", value: "yes" }]
                  : []),
              ],
            },
          ];

          fulfillment.tags = preTags;

          delete fulfillment.state;
        }

        return fulfillment;
      }
    );
  }

  existingPayload.message.order.updated_at = existingPayload.context.timestamp;

  return existingPayload;
}
