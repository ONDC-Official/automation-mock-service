import { timeStamp } from "console";
import { SessionData } from "../../../../session-types";

export const onUpdateIgmReplacementGenerator = (
  existingPayload: any,
  sessionData: SessionData,
  action_id: string
) => {
  const item = sessionData.items;

  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }

  if (sessionData.order_state) {
    existingPayload.message.order.state = sessionData.order_state;
  }

  if (sessionData.provider) {
    existingPayload.message.order.provider = sessionData.provider;
  }

  if (sessionData.items) {
    item[0].quantity =
      typeof item[0]?.quantity === "object"
        ? { count: (item[0]?.quantity?.count || 1) - 1 }
        : (item[0]?.quantity || 1) - 1;

    existingPayload.message.order.items = [
      ...item,
      {
        id: item[0]?.id || "I1",
        fulfillment_id: "R1",
        quantity: { count: 1 },
      },
    ];
  }

  if (sessionData.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  if (sessionData.payment) {
    existingPayload.message.order.payment = sessionData.payment;
  }

  if (sessionData.fulfillments) {
    const forwardFulfillment = sessionData.fulfillments.find(
      (f: any) => f.type === "Delivery"
    );

    const currentTime = new Date();
    const startRangeStart = currentTime.toISOString();
    const startRangeEnd = new Date(
      currentTime.getTime() + 10 * 60 * 1000
    ).toISOString();

    const isoDurToSec = (duration: string) => {
      const durRE =
        /P((\d+)Y)?((\d+)M)?((\d+)W)?((\d+)D)?T?((\d+)H)?((\d+)M)?((\d+)S)?/;

      const splitTime = durRE.exec(duration);
      if (!splitTime) {
        return 0;
      }

      const years = Number(splitTime?.[2]) || 0;
      const months = Number(splitTime?.[4]) || 0;
      const weeks = Number(splitTime?.[6]) || 0;
      const days = Number(splitTime?.[8]) || 0;
      const hours = Number(splitTime?.[10]) || 0;
      const minutes = Number(splitTime?.[12]) || 0;
      const seconds = Number(splitTime?.[14]) || 0;

      return (
        years * 31536000 +
        months * 2628288 +
        weeks * 604800 +
        days * 86400 +
        hours * 3600 +
        minutes * 60 +
        seconds
      );
    };

    const replacementFulfillment = { ...forwardFulfillment, id: "FR1" };

    const time = new Date();
    const start_end = new Date(time.getTime() + 10 * 60 * 1000).toISOString();

    existingPayload.message.order.fulfillments = [
      ...sessionData.fulfillments,
      {
        id: "R1",
        type: "Return",
        "@ondc/org/provider_name": "LSP courier 1",
        state: {
          descriptor: {
            code: "Return_Picked",
          },
        },
        tags: [
          {
            code: "return_request",
            list: [
              { code: "id", value: "R1" },
              { code: "item_id", value: item[0]?.id || "I1" },
              { code: "parent_item_id", value: item[0]?.id || "I1" },
              {
                code: "item_quantity",
                value: String(item[0]?.quantity?.count) || "1",
              },
              { code: "reason_id", value: "003" },
              { code: "reason_desc", value: "detailed description for return" },
              { code: "images", value: "url_for_image1,url_for_image2" },
              { code: "ttl_approval", value: "PT24H" },
              { code: "ttl_reverseqc", value: "P3D" },
              { code: "initiated_by", value: existingPayload?.context?.bap_id },
              { code: "replace", value: "yes" },
            ],
          },
          {
            code: "igm_request",
            list: [{ code: "id", value: sessionData.issue_id || "Issue1" }],
          },
          {
            code: "replace_request",
            list: [{ code: "id", value: "FR1" }],
          },
        ],
        start: {
          ...forwardFulfillment?.end,
          time: {
            ...forwardFulfillment?.end?.time,
            range: {
              start: startRangeStart,
              end: startRangeEnd,
            },
            timestamp: new Date().toISOString(),
          },
        },
        end: {
          ...forwardFulfillment?.start,
          time: {
            range: {
              start: start_end,
              end: new Date(
                time.getTime() +
                  1000 *
                    isoDurToSec(forwardFulfillment["@ondc/org/TAT"] || "PT0H")
              ).toISOString(),
            },
          },
        },
      },
      replacementFulfillment,
    ];
  }

  if (sessionData.quote) {
    existingPayload.message.order.quote = sessionData.quote;
  }

  existingPayload.message.order.updated_at =
    sessionData?.confirm_created_at_timestamp ?? new Date().toISOString();
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;
  return existingPayload;
};
