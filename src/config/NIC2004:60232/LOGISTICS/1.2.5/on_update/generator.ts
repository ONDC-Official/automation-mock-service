import { populateFulfillmentUpdate } from "../common_generator";
import { getTimestampFromDuration } from "../../../../../utils/generic-utils";
import { SessionData } from "../../../session-types";

interface Tag {
  code: string;
  list: { code: string; value: string }[];
}

function removeTagsByCodes(tags: Tag[], codesToRemove: string[]): Tag[] {
  return tags.filter((tag) => !codesToRemove.includes(tag.code));
}

export const onUpdateGenerator = (
  existingPayload: any,
  sessionData: SessionData
) => {
  if (sessionData?.fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
  }

  existingPayload = populateFulfillmentUpdate(existingPayload, sessionData);

  if (sessionData.shipment_method === "P2H2P") {
    existingPayload.message.order.fulfillments =
      existingPayload.message.order.fulfillments.map((fulfillment: any) => {
        fulfillment["@ondc/org/awb_no"] = "1227262193237777";

        const expiryDate = getTimestampFromDuration(
          existingPayload.context.timestamp,
          "P2D"
        );
        fulfillment["@ondc/org/ewaybillno"] = "EBN1";
        fulfillment["@ondc/org/ebnexpirydate"] = expiryDate;

        fulfillment.tags.push({
          code: "shipping_label",
          list: [
            {
              code: "type",
              value: "pdf",
            },
            {
              code: "url",
              value: "public link to pdf",
            },
          ],
        });
        fulfillment.tags.push({
          code: "ebn",
          list: [
            {
              code: "id",
              value: "EBN1",
            },
            {
              code: "expiry_date",
              value: expiryDate,
            },
          ],
        });
        return fulfillment;
      });
  }

  existingPayload.message.order.fulfillments =
    existingPayload.message.order.fulfillments.map((fulfillmet: any) => {
      fulfillmet.tags = removeTagsByCodes(fulfillmet.tags, [
        "state",
        "rto_action",
        "weather_check",
      ]);

      return fulfillmet;
    });

  existingPayload.message.order.updated_at = existingPayload.context.timestamp;

  existingPayload.message.order.quote = sessionData.quote;

  return existingPayload;
};
