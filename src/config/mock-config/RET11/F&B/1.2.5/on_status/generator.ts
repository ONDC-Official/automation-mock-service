import { getTimestampFromDuration } from "../../../../../../utils/generic-utils";
import { SessionData, Input } from "../../../session-types";

export const onStatusGenerator = (
  existingPayload: any,
  sessionData: SessionData,
  inputs?: Input
) => {
  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }

  if (sessionData.provider) {
    existingPayload.message.order.provider = sessionData.provider;
  }

  if (sessionData.items) {
    existingPayload.message.order.items = sessionData.items;
  }

  if (sessionData.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  if (sessionData.quote) {
    existingPayload.message.order.quote = sessionData.quote;
  }

  if (sessionData.payment) {
    existingPayload.message.order.payment = sessionData.payment;
  }

  if (sessionData.fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
  }

  switch (sessionData?.stateCode) {
    case "Pending":
      existingPayload.message.order.state = "Accepted";
      existingPayload.message.order.fulfillments[0].state.descriptor.code =
        sessionData.stateCode;

      if (inputs?.isSlottedDelivery !== "yes") {
        existingPayload.message.order.fulfillments[0].start.time = {
          ...existingPayload.message.order.fulfillments[0].start.time,
          range: {
            start: existingPayload.context.timestamp,
            end: getTimestampFromDuration(
              existingPayload.context.timestamp,
              "PT30M"
            ),
          },
        };

        existingPayload.message.order.fulfillments[0].end.time = {
          ...existingPayload.message.order.fulfillments[0].start.time,
          range: {
            start: getTimestampFromDuration(
              existingPayload.context.timestamp,
              "PT30M"
            ),
            end: getTimestampFromDuration(
              existingPayload.context.timestamp,
              existingPayload.message.order.fulfillments[0]?.tat || "PT30M"
            ),
          },
        };
      }

      existingPayload.message.order.fulfillments[0].tags = [
        {
          code: "routing",
          list: [
            {
              code: "type",
              value: "P2P",
            },
          ],
        },
        {
          code: "tracking",
          list: [
            {
              code: "gps_enabled",
              value: "yes",
            },
            {
              code: "url_enabled",
              value: "no",
            },
            {
              code: "url",
              value: "https://sellerNP.com/ondc/tracking_url",
            },
          ],
        },
      ];
      break;
    case "Packed":
      existingPayload.message.order.state = "In-progress";
      existingPayload.message.order.fulfillments[0].state.descriptor.code =
        sessionData.stateCode;

      // intruction inside start for self pickup

      // "instructions":
      // {
      //   "code":"1",
      //   "name":"ONDC order",
      //   "short_desc":"93342342342", // pick from fullfillment end phone
      //   "long_desc":"additional instructions such as register or counter no for self-pickup"
      // }

      break;
    case "Agent-assigned":
      existingPayload.message.order.state = "In-progress";
      existingPayload.message.order.fulfillments[0].state.descriptor.code =
        sessionData.stateCode;
      existingPayload.message.order.fulfillments[0].agent = {
        name: "agent_name",
        phone: "9886098860",
      };
      existingPayload.message.order.fulfillments[0].vehicle = {
        registration: "3LVJ945",
      };

      break;
    case "At-pickup":
      existingPayload.message.order.state = "In-progress";
      existingPayload.message.order.fulfillments[0].state.descriptor.code =
        sessionData.stateCode;

      break;
    case "Order-picked":
      existingPayload.message.order.state = "In-progress";
      existingPayload.message.order.fulfillments[0].state.descriptor.code =
        "Order-picked-up";
      existingPayload.message.order.documents = [
        {
          url: "https://invoice_url",
          label: "Invoice",
        },
      ];
      existingPayload.message.order.fulfillments[0].start.time = {
        timestamp: existingPayload.context.timestamp,
      };
      break;
    case "At-delivery":
      existingPayload.message.order.state = "In-progress";
      existingPayload.message.order.fulfillments[0].state.descriptor.code =
        sessionData.stateCode;
      break;
    case "Order-delivered":
      existingPayload.message.order.state = "Completed";
      existingPayload.message.order.fulfillments[0].state.descriptor.code =
        sessionData.stateCode;
      existingPayload.message.order.fulfillments[0].end.time = {
        timestamp: existingPayload.context.timestamp,
      };
      break;
    case "Order-picked-self-delivery":
      existingPayload.message.order.state = "Completed";
      existingPayload.message.order.fulfillments[0].state.descriptor.code =
        "Order-picked-up";
      existingPayload.message.order.fulfillments[0].end.time = {
        timestamp: existingPayload.context.timestamp,
      };
      break;
    case "RTO-Disposed":
      existingPayload.message.order.state = "Completed";
      existingPayload.message.order.fulfillments =
        existingPayload.message.order.fulfillments.map((fulfillment: any) => {
          if (fulfillment.type === "RTO") {
            fulfillment.state.descriptor.code = sessionData.stateCode;
            return fulfillment;
          }
          return fulfillment;
        });
      break;
  }

  existingPayload.message.order.created_at =
    sessionData.confirm_created_at_timestamp;
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;

  return existingPayload;
};
