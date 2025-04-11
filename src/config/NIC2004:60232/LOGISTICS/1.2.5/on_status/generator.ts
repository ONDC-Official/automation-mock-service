import { SessionData } from "../../../session-types";

import {
  isEmpty,
  getFutureDateInMinutes,
  removeTagsByCodes,
} from "../../../../../utils/generic-utils";

const getPaymentStatus = (paymentType: string, orderState: string) => {
  if (paymentType === "ON-FULFILLMENT" && orderState === "Completed") {
    return "PAID";
  }

  if (paymentType === "ON-ORDER") {
    return "PAID";
  }

  if (paymentType === "POST-FULFILLMENT") {
    return "NOT-PAID";
  }

  return "NOT-PAID";
};

export const onStatusGenerator = async (
  existingPayload: any,
  sessionData: SessionData
) => {
  existingPayload.message.order.id = sessionData.order_id;
  if (sessionData?.fulfillments) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
  }

  switch (sessionData.stateCode) {
    case "Order-picked-up":
      existingPayload.message.order.state = "In-progress";
      existingPayload.message.order.fulfillments =
        existingPayload.message.order.fulfillments.map((fulfillemt: any) => {
          fulfillemt.state.descriptor.code = sessionData.stateCode;
          fulfillemt.start.time = {
            ...fulfillemt.start.time,
            timestamp: existingPayload.context?.timestamp,
          };
          const p2pList = [
            {
              code: "gps_enabled",
              value: "yes",
            },
            {
              code: "url_enabled",
              value: "no",
            },
          ];

          const p2h2pList = [
            {
              code: "gps_enabled",
              value: "no",
            },
            {
              code: "url_enabled",
              value: "yes",
            },
            {
              code: "url",
              value: "https://tracking_url.com",
            },
          ];

          fulfillemt.tags.push({
            code: "tracking",
            list: sessionData?.domain === "ONDC:LOG10" ? p2pList : p2h2pList,
          });
          return fulfillemt;
        });
      break;
    case "Out-for-delivery":
      existingPayload.message.order.state = "In-progress";
      existingPayload.message.order.fulfillments =
        existingPayload.message.order.fulfillments.map((fulfillemt: any) => {
          fulfillemt.state.descriptor.code = sessionData.stateCode;
          return fulfillemt;
        });
      break;
    case "At-pickup":
      existingPayload.message.order.state = "In-progress";
      existingPayload.message.order.fulfillments =
        existingPayload.message.order.fulfillments.map((fulfillemt: any) => {
          fulfillemt.state.descriptor.code = sessionData.stateCode;
          return fulfillemt;
        });
      break;
      case "At-delivery":
        existingPayload.message.order.state = "In-progress";
        existingPayload.message.order.fulfillments =
          existingPayload.message.order.fulfillments.map((fulfillemt: any) => {
            fulfillemt.state.descriptor.code = sessionData.stateCode;
            return fulfillemt;
          });
        break;
    case "Order-delivered":
      existingPayload.message.order.state = "Completed";
      existingPayload.message.order.fulfillments =
        existingPayload.message.order.fulfillments.map((fulfillemt: any) => {
          fulfillemt.state.descriptor.code = sessionData.stateCode;
          fulfillemt.end.time.timestamp = existingPayload.context.timestamp;
          if (sessionData?.is_cod === "yes") {
            fulfillemt.tags.push({
              code: "cod_collection_detail",
              list: [
                {
                  code: "currency",
                  value: "INR",
                },
                {
                  code: "value",
                  value: "300.00",
                },
                {
                  code: "transaction_id",
                  value: "3937",
                },
                {
                  code: "timestamp",
                  value: existingPayload.context.timestamp,
                },
              ],
            });
          }
          return fulfillemt;
        });
      break;
    case "RTO-Delivered":
      existingPayload.message.order.state = "Completed";
      existingPayload.message.order.fulfillments =
        existingPayload.message.order.fulfillments.map((fulfillment: any) => {
          if (fulfillment.type === "RTO") {
            let fulfillmentState = "RTO-Disposed";

            sessionData?.confirm_fulfillments?.forEach((item: any) => {
              item.tags.forEach((tag: any) => {
                if (tag.code === "rto_action") {
                  tag.list.forEach((lst: any) => {
                    if (
                      lst.code === "return_to_origin" &&
                      lst.value === "yes"
                    ) {
                      fulfillmentState = "RTO-Delivered";
                    }
                  });
                }
              });
            });

            fulfillment.state.descriptor.code = fulfillmentState;
            fulfillment.end = {
              time: { timestamp: existingPayload.context.timestamp },
            };
          }
          return fulfillment;
        });
      break;
    case "At-destination-hub":
      existingPayload.message.order.fulfillments =
        existingPayload.message.order.fulfillments.map((fulfillemt: any) => {
          fulfillemt.state.descriptor.code = sessionData.stateCode;
          return fulfillemt;
        });
      break;
    case "In-transit":
      existingPayload.message.order.fulfillments =
        existingPayload.message.order.fulfillments.map((fulfillemt: any) => {
          fulfillemt.state.descriptor.code = sessionData.stateCode;
          return fulfillemt;
        });
      break;
    case "Pickup-rescheduled":
      existingPayload.message.order.fulfillments =
        existingPayload.message.order.fulfillments.map((fulfillemt: any) => {
          fulfillemt.state.descriptor.code = sessionData.stateCode;
          fulfillemt.start.time.range = {
            start: getFutureDateInMinutes(10),
            end: getFutureDateInMinutes(30),
          };
          fulfillemt.end.time.range = {
            start: getFutureDateInMinutes(120),
            end: getFutureDateInMinutes(150),
          };
          fulfillemt.tags.push({
            code: "fulfillment_delay",
            list: [
              {
                code: "state",
                value: "Order-picked-up",
              },
              {
                code: "reason_id",
                value: "004",
              },
              {
                code: "timestamp",
                value: existingPayload.context.timestamp,
              },
              {
                code: "attempt",
                value: "yes",
              },
            ],
          });
          return fulfillemt;
        });
      break;
    case "Out-for-pickup":
      existingPayload.message.order.fulfillments =
        existingPayload.message.order.fulfillments.map((fulfillemt: any) => {
          fulfillemt.state.descriptor.code = sessionData.stateCode;
          return fulfillemt;
        });
      break;
    case "Delivery-rescheduled":
      existingPayload.message.order.fulfillments =
        existingPayload.message.order.fulfillments.map((fulfillemt: any) => {
          fulfillemt.state.descriptor.code = sessionData.stateCode;
          fulfillemt.end.time.range = {
            start: getFutureDateInMinutes(30),
            end: getFutureDateInMinutes(50),
          };
          fulfillemt.tags.push({
            code: "fulfillment_delay",
            list: [
              {
                code: "state",
                value: "Order-delivered",
              },
              {
                code: "reason_id",
                value: "005",
              },
              {
                code: "timestamp",
                value: existingPayload.context.timestamp,
              },
              {
                code: "attempt",
                value: "yes",
              },
            ],
          });
          return fulfillemt;
        });
      break;
    case "Agent-assigned":
      existingPayload.message.order.fulfillments =
        existingPayload.message.order.fulfillments.map((fulfillemt: any) => {
          fulfillemt.state.descriptor.code = sessionData.stateCode;
          fulfillemt.tags = [
            ...removeTagsByCodes(fulfillemt.tags, [
              "weather_check",
              "rto_action",
              "state",
            ]),
            ...(sessionData?.rate_basis
              ? [
                  {
                    code: "rider_details",
                    list: [
                      {
                        code: "name",
                        value: "person_name1",
                      },
                      {
                        code: "phone",
                        value: "9886098860",
                      },
                      {
                        code: "vehicle_registration",
                        value: "3LVJ945",
                      },
                    ],
                  },
                  {
                    code: "rider_details",
                    list: [
                      {
                        code: "name",
                        value: "person_name2",
                      },
                      {
                        code: "phone",
                        value: "9886098860",
                      },
                      {
                        code: "vehicle_registration",
                        value: "3KVJ947",
                      },
                    ],
                  },
                ]
              : []),
          ];
          return fulfillemt;
        });
      break;
    default:
      existingPayload.message.order.state = "In-progress";
  }

  if (sessionData?.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  existingPayload.message.order.updated_at = existingPayload.context.timestamp;

  existingPayload.message.order.quote = sessionData.quote;

  if (sessionData.payment) {
    existingPayload.message.order.payment = sessionData.payment;
  }

  existingPayload.message.order.payment.status = getPaymentStatus(
    sessionData.payment_type as string,
    existingPayload.message.order.state
  );

  if (
    sessionData.payment_type === "ON-FULFILLMENT" &&
    existingPayload.message.order.state === "Completed"
  ) {
    existingPayload.message.order.payment["@ondc/org/settlement_details"] = [
      {
        ...existingPayload.message.order.payment[
          "@ondc/org/settlement_details"
        ][0],
        settlement_status: "PAID",
        settlement_reference: "XXXXXXXXX",
        settlement_timestamp: existingPayload.context.timestamp,
      },
    ];
  }

  if (sessionData?.items) {
    existingPayload.message.order.items = sessionData.items;
  }

  if (!isEmpty(sessionData?.cancellation)) {
    existingPayload.message.order.cancellation = sessionData.cancellation;
  }

  if (sessionData.linked_order) {
    existingPayload.message.order["@ondc/org/linked_order"] =
      sessionData.linked_order;
  }

  return existingPayload;
};
