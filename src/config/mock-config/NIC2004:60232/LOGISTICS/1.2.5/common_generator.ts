import { SessionData } from "../../session-types";
import { getTimestampFromDuration } from "../../../../../utils/generic-utils";

export const populateFulfillmentUpdate = (
  existingPayload: any,
  sessionData: SessionData
) => {
  existingPayload.message.order.fulfillments =
    existingPayload.message.order.fulfillments.map((fulfillment: any) => {
      let isReadyToShip = false;
      let isOrderReady = false;

      if (sessionData.update_fulfillments?.length) {
        sessionData.update_fulfillments.forEach((fulfillment: any) => {
          if (fulfillment.tags?.length) {
            fulfillment.tags.forEach((tag: any) => {
              if (tag.code === "state") {
                tag.list?.forEach((item: any) => {
                  if (item.code === "ready_to_ship" && item.value === "yes") {
                    isReadyToShip = true;
                  }
                  if (item.code === "order_ready" && item.value === "yes") {
                    isOrderReady = true;
                  }
                });
              }
            });
          }
        });
      }

      fulfillment.tracking = true;

      if (isReadyToShip) {
        if (!sessionData?.rate_basis && !isOrderReady) {
          fulfillment.state.descriptor.code = "Searching-for-Agent";
        } else if (isOrderReady) {
          fulfillment.state.descriptor.code = "At-pickup";
        }

        if (!fulfillment.start?.time?.range) {
          fulfillment.start.time = {
            ...fulfillment.start.time,
            range: {
              start: existingPayload.context.timestamp,
              end: getTimestampFromDuration(
                existingPayload.context.timestamp,
                fulfillment?.start?.time?.duration || "P4H"
              ),
            },
          };

          fulfillment.end.time = {
            range: {
              start: fulfillment?.start?.time?.range?.end,
              end: getTimestampFromDuration(
                fulfillment?.start?.time?.range?.end,
                sessionData?.tat || "P1D"
              ),
            },
          };
        }
      }

      return fulfillment;
    });

  return existingPayload;
};

export const populateFulfillmentConfim = (
  existingPayload: any,
  sessionData: SessionData
) => {
  existingPayload.message.order.fulfillments =
    existingPayload.message.order.fulfillments.map((fulfillment: any) => {
      let isReadyToShip = false;

      fulfillment.tags.forEach((tag: any) => {
        if (tag.code === "state") {
          tag.list.forEach((item: any) => {
            if (item.code === "ready_to_ship" && item.value == "yes") {
              isReadyToShip = true;
            }
          });
        }
      });

      fulfillment.tracking = true;

      if (isReadyToShip) {
        fulfillment.state = {
          descriptor: {
            code: "Agent-assigned",
          },
        };
        fulfillment.agent = {
          name: "person_name",
          phone: "9886098860",
        };
        fulfillment.vehicle = {
          registration: "3LVJ945",
        };

        if (!existingPayload.message.order.fulfillments[0].start?.time?.range) {
          fulfillment.start.time.range = {
            start: existingPayload.context.timestamp,
            end: getTimestampFromDuration(
              existingPayload.context.timestamp,
              fulfillment?.start?.time?.duration || "P1D"
            ),
          };

          fulfillment.end.time = {
            range: {
              start: fulfillment?.start?.time?.range?.end,
              end: getTimestampFromDuration(
                existingPayload.context.timestamp,
                sessionData?.tat || "P1D"
              ),
            },
          };
        }
      }

      return fulfillment;
    });

  return existingPayload;
};
