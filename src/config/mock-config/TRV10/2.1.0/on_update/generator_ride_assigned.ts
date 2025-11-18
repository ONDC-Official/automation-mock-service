import { SessionData } from "../../session-types";
import { onUpdateMultipleStopsGenerator } from "./generator_multiple_stops";

const agent = {
  contact: {
    phone: "9856798567",
  },
  person: {
    name: "Jason Roy",
  },
};
function generateToken() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function updateSettlementAmount(terms: any[], quote: any) {
  const total = Number(quote?.price?.value || 0);

  terms.forEach((termBlock) => {
    if (!termBlock.list) return;

    const buyerFeeItem =
      termBlock.list.find(
        (i: any) => i.descriptor?.code === "BUYER_FINDER_FEES_PERCENTAGE"
      ) || 1;
    const settlementItem = termBlock.list.find(
      (i: any) => i.descriptor?.code === "SETTLEMENT_AMOUNT"
    );

    if (buyerFeeItem && settlementItem) {
      const percentage = Number(buyerFeeItem.value || 0);
      const settlementAmount = ((total * percentage) / 100).toFixed(2);
      settlementItem.value = settlementAmount;
    }
  });

  return terms;
}

function updateFulfillmentStatus(order: any) {
  // Check if fulfillments exist
  if (order.fulfillments) {
    order.fulfillments.forEach((fulfillment: any) => {
      fulfillment.state.descriptor.code = "RIDE_ASSIGNED";
      const startStop = fulfillment.stops.find(
        (stop: any) => stop.type === "START"
      );
      const endStop = fulfillment.stops.find(
        (stop: any) => stop.type === "END"
      );
      if (startStop) {
        const now = new Date();
        const newTime = new Date(now.getTime() + 15 * 60000).toISOString();
        startStop.time = {
          timestamp: now.toISOString(),
        };
        startStop.authorization = {
          token: generateToken(),
          type: "OTP",
          valid_to: newTime,
          status: "UNCLAIMED",
        };
      }
      if (endStop) {
        const now = new Date();
        const newTime = new Date(
          now.getTime() + 3 * 24 * 60 * 60 * 1000
        ).toISOString();
        endStop.authorization = {
          token: generateToken(),
          type: "OTP",
          valid_to: newTime,
          status: "UNCLAIMED",
        };
      }

      if (
        !fulfillment.vehicle.registration ||
        !fulfillment.vehicle.make ||
        !fulfillment.vehicle.model
      ) {
        fulfillment.vehicle.registration = "KA-01-AD-9876";
        fulfillment.vehicle.make = "Bajaj";
        fulfillment.vehicle.model = "Compact RE";
      }
    });
  }
  return order;
}

function updateFulfillmentRouteTags(tags: any[]) {
  return tags.map((tag) => {
    if (tag.descriptor?.code === "ROUTE_INFO" && Array.isArray(tag.list)) {
      return {
        ...tag,
        list: tag.list.map((t: any) => {
          if (t.descriptor.code === "ENCODED_POLYLINE") {
            return { ...t, value: t.value + "K" };
          }
          if (t.descriptor.code === "WAYPOINTS") {
            const waypoints = JSON.parse(t.value);
            const updatedWaypoints = waypoints.map((wp: any) => {
              const [lat, lng] = wp.gps.split(",").map(Number);
              return {
                gps: `${(lat + 0.00001).toFixed(6)},${(lng + 0.00001).toFixed(
                  6
                )}`,
              };
            });
            return { ...t, value: JSON.stringify(updatedWaypoints) };
          }
          return t;
        }),
      };
    }
    return tag;
  });
}

// Helper function to slightly modify distance and ETA
function updateItemInfoTags(tags: any[]) {
  return tags.map((tag) => {
    if (tag.descriptor?.code === "INFO" && Array.isArray(tag.list)) {
      return {
        ...tag,
        list: tag.list.map((t: any) => {
          if (t.descriptor.code === "DISTANCE_TO_NEAREST_DRIVER_METER") {
            // Slightly adjust distance, e.g., add 5 meters
            const distance = Number(t.value || 0);
            return { ...t, value: (distance - 5).toString() };
          }
          if (t.descriptor.code === "ETA_TO_NEAREST_DRIVER_MIN") {
            // Slightly adjust ETA, e.g., add 1 minute
            const eta = Number(t.value || 0);
            return { ...t, value: (eta - 0.2).toString() };
          }
          return t;
        }),
      };
    }
    return tag;
  });
}

export async function onUpdateRideAssignedGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload = await onUpdateMultipleStopsGenerator(
    existingPayload,
    sessionData
  );
  existingPayload.message.order = updateFulfillmentStatus(
    existingPayload.message.order
  );
  existingPayload.message.order.fulfillments[0]["agent"] = agent;

  // UPDATE SETTLEMENT AMOUNT BASED ON QUOTE PRICE
  if (existingPayload.message.order.tags) {
    existingPayload.message.order.tags = updateSettlementAmount(
      existingPayload.message.order.tags,
      sessionData.quote
    );
  }

  if (Array.isArray(existingPayload.message.order.fulfillments[0].tags)) {
    existingPayload.message.order.fulfillments[0].tags =
      updateFulfillmentRouteTags(
        existingPayload.message.order.fulfillments[0].tags
      );
  }

  if (existingPayload.message.order.items?.length > 0) {
    existingPayload.message.order.items =
      existingPayload.message.order.items.map((item: any) => {
        if (Array.isArray(item.tags)) {
          item.tags = updateItemInfoTags(item.tags);
        }
        return item;
      });
  }
  return existingPayload;
}
