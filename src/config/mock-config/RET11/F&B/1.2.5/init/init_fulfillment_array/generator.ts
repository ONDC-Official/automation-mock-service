import { SessionData, Input } from "../../../../session-types";

export async function initFulfillmentArrayGenerator(
  existingPayload: any,
  sessionData: SessionData,
  inputs?: Input
) {
  console.log("sessionData.provider:", JSON.stringify(sessionData?.provider));
  console.log("sessionData.on_select_items:", JSON.stringify(sessionData?.on_select_items));
  console.log("sessionData.fulfillments:", JSON.stringify(sessionData?.fulfillments));
  console.log("sessionData.select_fulfillment:", JSON.stringify(sessionData?.select_fulfillment));

  if (sessionData?.provider) {
    console.log("Setting provider:", JSON.stringify(sessionData.provider));
    existingPayload.message.order.provider = sessionData.provider;
  }

  if (sessionData?.on_select_items) {
    console.log(
      "Mapping on_select_items. Count:",
      JSON.stringify(sessionData.on_select_items.length)
    );
    existingPayload.message.order.items = sessionData.on_select_items.map(
      (item: any, index: number) => {
        console.log(
          `Processing item[${index}]:`,
          JSON.stringify(item, null, 2)
        );

        console.log(
          `item[${index}].fulfillment_ids:`,
          JSON.stringify(item?.fulfillment_ids)
        );

        const fulfillmentId = item.fulfillment_ids[0];
        console.log(
          `Extracted fulfillmentId from item[${index}]:`,
          JSON.stringify(fulfillmentId)
        );

        if (!item?.fulfillment_ids) {
          console.log(`⚠️ fulfillment_ids missing in item[${index}]`);
        }

        delete item.fulfillment_ids;

        return {
          ...item,
          fulfillment_id: fulfillmentId,
        };
      }
    );
    console.log(
      "Items after mapping:",
      JSON.stringify(existingPayload.message.order.items, null, 2)
    );
  }

  console.log(
    "Billing before timestamps:",
    JSON.stringify(existingPayload?.message?.order?.billing, null, 2)
  );


  existingPayload.message.order.billing.created_at =
    existingPayload.context.timestamp;
  existingPayload.message.order.billing.updated_at =
    existingPayload.context.timestamp;

    console.log(
      "select_fulfillment log:",
      JSON.stringify(sessionData?.select_fulfillment)
    );

  if (sessionData.select_fulfillment && sessionData.select_fulfillment.length) {
    console.log(
      "select_fulfillment length:",
      JSON.stringify(sessionData.select_fulfillment.length)
    );

    console.log(
      "select_fulfillment[0]:",
      JSON.stringify(sessionData?.select_fulfillment?.[0], null, 2)
    );

    console.log(
      "sessionData.fulfillments before map:",
      JSON.stringify(sessionData?.fulfillments, null, 2)
    );
    existingPayload.message.order.fulfillments = sessionData.fulfillments?.map(
      (fulfillment: any, index: number) => {
        console.log(
          `Processing fulfillment[${index}]:`,
          JSON.stringify(fulfillment, null, 2)
        );
        console.log(
          `GPS used for fulfillment[${index}]:`,
          JSON.stringify(sessionData?.select_fulfillment?.[0]?.end?.location?.gps)
        );

        return {
          ...fulfillment,
          end: {
            location: {
              gps: sessionData?.select_fulfillment?.[0]?.end?.location?.gps,
              address: existingPayload.message.order.billing.address,
            },
            contact: {
              phone: "9886098860",
            },
          },
        };
      }
    );
  }

  return existingPayload;
}
