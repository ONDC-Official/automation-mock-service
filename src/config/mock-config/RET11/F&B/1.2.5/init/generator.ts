import { SessionData, Input } from "../../../session-types";

export async function initGenerator(
  existingPayload: any,
  sessionData: SessionData,
  inputs?: Input
) {
  console.log("===== INIT GENERATOR START =====");
  console.log("sessionData =>", JSON.stringify(sessionData, null, 2));
  console.log("inputs =>", JSON.stringify(inputs, null, 2));

  try {
    if (sessionData?.provider) {
      console.log("Provider found");
      existingPayload.message.order.provider = sessionData.provider;
    } else {
      console.log("Provider missing in sessionData");
    }

    console.log(
      "select_fulfillment =>",
      JSON.stringify(sessionData?.select_fulfillment, null, 2)
    );

    existingPayload.message.order.billing.address = {
      name: "my house or door or floor #",
      building: "my building name or house #",
      locality: "my street name",
      city: "my city",
      state: "my state",
      country: "IND",
      area_code:
        sessionData?.select_fulfillment?.[0]?.end?.location?.address
          ?.area_code || "110125",
    };

    existingPayload.message.order.billing.created_at =
      existingPayload.context.timestamp;

    existingPayload.message.order.billing.updated_at =
      existingPayload.context.timestamp;

    const selectedFulfillmentType =
      inputs?.fulfillmentType || "Delivery";

    console.log("selectedFulfillmentType =>", selectedFulfillmentType);

    console.log(
      "sessionData.fulfillments =>",
      JSON.stringify(sessionData?.fulfillments, null, 2)
    );

    const selectedFulfillment = sessionData?.fulfillments?.find(
      (fulfillment: any) =>
        fulfillment?.type === selectedFulfillmentType
    );

    console.log(
      "selectedFulfillment =>",
      JSON.stringify(selectedFulfillment, null, 2)
    );

    if (!selectedFulfillment) {
      console.log(
        "ERROR: Matching fulfillment not found. init payload cannot generate."
      );
    }

    if (sessionData?.items) {
      console.log("Items found =>", sessionData.items.length);

      existingPayload.message.order.items =
        sessionData.items.map((item: any) => {
          item.fulfillment_id = selectedFulfillment?.id;
          return item;
        });
    } else {
      console.log("Items missing in sessionData");
    }

    if (sessionData?.select_fulfillment) {
      console.log("Generating order.fulfillments");

      existingPayload.message.order.fulfillments = [
        {
          id: selectedFulfillment?.id,
          type: selectedFulfillment?.type,
          end: {
            location: {
              gps:
                sessionData?.select_fulfillment?.[0]?.end
                  ?.location?.gps,

              ...(selectedFulfillment?.type === "Self-Pickup"
                ? {}
                : {
                    address: {
                      ...existingPayload.message.order.billing
                        .address,
                      area_code:
                        sessionData?.select_fulfillment?.[0]
                          ?.end?.location?.address?.area_code,
                    },
                  }),
            },
            contact: {
              phone: "9886098860",
            },
          },
          ...(selectedFulfillment?.tags
            ? { tags: selectedFulfillment.tags }
            : {}),
        },
      ];
    } else {
      console.log("select_fulfillment missing");
    }

    if (sessionData?.offers?.length) {
      console.log("Offers found");
      existingPayload.message.order.offers =
        sessionData.offers;
    }

    console.log(
      "FINAL INIT PAYLOAD =>",
      JSON.stringify(existingPayload, null, 2)
    );

    console.log("===== INIT GENERATOR END =====");

    return existingPayload;
  } catch (error) {
    console.log("INIT GENERATOR ERROR =>", error);
    throw error;
  }
}