import { SessionData } from "../../session-types";

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

function updateFulfillmentRouteTags(tags: any[]) {
  return tags.map((tag) => {
    if (tag.descriptor?.code === "ROUTE_INFO" && Array.isArray(tag.list)) {
      return {
        ...tag,
        list: tag.list.map((t: any) => {
          if (t.descriptor.code === "ENCODED_POLYLINE") {
            return { ...t, value: t.value + "D" };
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

export async function onStatusMultipleStopsGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  if (sessionData.payments.length > 0) {
    existingPayload.message.order.payments = sessionData.payments;
  }

  if (sessionData.items.length > 0) {
    existingPayload.message.order.items = sessionData.items;
  }

  if (sessionData?.cancellation_fulfillments.length > 0) {
    existingPayload.message.order.fulfillments =
      sessionData?.cancellation_fulfillments;
  } else if (sessionData.fulfillments.length > 0) {
    existingPayload.message.order.fulfillments =
      sessionData.selected_fulfillments;
  }

  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }

  if (sessionData.cancellation_quote != null) {
    existingPayload.message.order.quote = sessionData?.cancellation_quote;
  } else if (sessionData.quote != null) {
    existingPayload.message.order.quote = sessionData.quote;
  }

  if (sessionData?.cancellation_reason != null) {
    existingPayload.message.order.cancellation =
      sessionData.cancellation_reason;
  }

  const now = new Date().toISOString();
  existingPayload.message.order.created_at = sessionData.created_at;
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;
  existingPayload.message.order.provider.id = sessionData.provider_id;
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
