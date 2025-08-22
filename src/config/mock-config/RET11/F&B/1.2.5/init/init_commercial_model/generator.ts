import { Input, SessionData } from "../../../../session-types";

export type SelectedNpFees = {
  item_id: string;
  id: string;
}[];

export async function initCommercialModelGenerator(
  existingPayload: any,
  sessionData: SessionData,
  inputs?: Input
) {
  if (sessionData?.provider) {
    existingPayload.message.order.provider = sessionData.provider;
  }

  existingPayload.message.order.billing.address = {
    name: "my house or door or floor #",
    building: "my building name or house #",
    locality: "my street name",
    city: "my city",
    state: "my state",
    country: "IND",
    area_code:
      sessionData?.select_fulfillment?.[0].end.location.address.area_code ||
      "110125",
  };

  existingPayload.message.order.billing.created_at =
    existingPayload.context.timestamp;
  existingPayload.message.order.billing.updated_at =
    existingPayload.context.timestamp;

  const npFeesRaw = inputs?.np_fees || [];
  
  const npFeesInput: SelectedNpFees = npFeesRaw?.map((code: string) => {
    const [item_id, npfId] = code.split("_npf_");
    return { item_id, id: `${npfId}` };
  });
  sessionData.selected_np_fees = npFeesInput as SelectedNpFees;


  const selectedFulfillmentType = inputs?.fulfillmentType || "Delivery";

  const selectedFulfillment = sessionData?.fulfillments?.find(
    (fulfillment) => fulfillment.type === selectedFulfillmentType
  );

  if (sessionData?.items) {
    existingPayload.message.order.items = sessionData.items.map((item) => {
      const npFee =
        npFeesInput?.find((fee) => fee.item_id === item.id) ?? {
          item_id: item.id,
          id: "1",
        };
        const existingTags = item.tags || [];
      item.fulfillment_id = selectedFulfillment.id;
      return {
        ...item,
        fulfillment_id: selectedFulfillment?.id,
        tags: [...existingTags,
          {
            code: "np_fees",
            list: [
              {
                code: "id",
                value: npFee.id,
              },
            ],
          },
        ],
      };
    });
  }

  if (sessionData.select_fulfillment) {
    existingPayload.message.order.fulfillments = [
      {
        id: selectedFulfillment?.id,
        type: selectedFulfillment?.type,
        end: {
          location: {
            gps: sessionData?.select_fulfillment[0].end.location.gps,
            ...(selectedFulfillment.type === "Self-Pickup"
              ? {}
              : {
                  address: {
                    ...existingPayload.message.order.billing.address,
                    area_code:
                      sessionData?.select_fulfillment[0].end.location.address
                        .area_code,
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
  }

  if (sessionData?.offers?.length) {
    existingPayload.message.order.offers = sessionData?.offers;
  }

  return existingPayload;
}
