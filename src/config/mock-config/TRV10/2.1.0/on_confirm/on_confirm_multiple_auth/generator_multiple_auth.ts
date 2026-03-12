import { randomBytes } from "crypto";
import { SessionData } from "../../../session-types";

const agent = {
  contact: {
    phone: "9856798567",
  },
  person: {
    name: "Jason Roy",
  },
};

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
function updateFulfillments(fulfillments: any[]) {
  return fulfillments.map((fulfillment) => {
    // Add the vehicle object to each fulfillment
    if (fulfillment.vehicle.category === "AUTO_RICKSHAW") {
      fulfillment.vehicle = {
        category: "AUTO_RICKSHAW",
        variant: "AUTO_RICKSHAW",
        make: "Bajaj",
        model: "Compact RE",
        registration: "KA-01-AD-9876",
      };
    } else {
      fulfillment.vehicle = {
        category: "CAB",
        variant: "SEDAN",
        make: "Maruti",
        model: "Swift Dzire",
        registration: "KA-01-AD-9876",
      };
    }

    // Find the stop with type "START"
    const startStop = fulfillment.stops.find(
      (stop: any) => stop.type === "START"
    );
    const endStop = fulfillment.stops.find((stop: any) => stop.type === "END");

    // If found, add the authorization object
    const now = new Date();
    const newTime = new Date(now.getTime() + 15 * 60000).toISOString();
    if (startStop) {
      startStop.authorization = {
        token: "234234",
        type: "OTP",
        valid_to: newTime,
        status: "UNCLAIMED",
      };
    }
    if (!endStop) {
      const now = new Date();
      const newTime = new Date(now.getTime() + 15 * 60000).toISOString();
      fulfillment.stops[1] = {
        authorization: {
          token: "234235",
          type: "OTP",
          valid_to: newTime,
          status: "UNCLAIMED",
        },
        type: "END",
      };
    } else {
      if (endStop.location) {
        delete endStop.location;
      }
      endStop.authorization = {
        token: "234235",
        type: "OTP",
        valid_to: newTime,
        status: "UNCLAIMED",
      };
    }

    return fulfillment;
  });
}

export async function onConfirmMultipleAuthGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  const randomId = Math.random().toString(36).substring(2, 15);
  const order_id = randomId;
  existingPayload.message.order.payments = sessionData.payments;

  // Check if items is a non-empty array
  if (sessionData.items.length > 0) {
    existingPayload.message.order.items = sessionData.items;
  }

  // Check if fulfillments is a non-empty array
  if (sessionData.selected_fulfillments.length > 0) {
    existingPayload.message.order.fulfillments =
      sessionData.selected_fulfillments;
    existingPayload.message.order.fulfillments = updateFulfillments(
      existingPayload.message.order.fulfillments
    );
    existingPayload.message.order.fulfillments[0]["agent"] = agent;
    existingPayload.message.order.fulfillments[0]["state"] = {
      descriptor: { code: "RIDE_ASSIGNED" },
    };
  }
  sessionData.quote.breakup = sessionData.quote.breakup.map(
    (breakup: { title: string; item: { add_ons: any[] } }) => {
      if (breakup.title === "ADD_ONS") {
        const updatedAddOns = breakup.item.add_ons.map((addOn: any) => {
          if (addOn.quantity && addOn.quantity.unitized !== undefined) {
            delete addOn.quantity.unitized;
          }
          return addOn;
        });

        return {
          ...breakup,
          item: {
            ...breakup.item,
            add_ons: updatedAddOns,
          },
        };
      }

      return breakup;
    }
  );

  if (sessionData.quote != null) {
    existingPayload.message.order.quote = sessionData.quote;
  }
  if (sessionData.items.length > 0) {
    existingPayload.message.order.items = sessionData.items;
  }

  existingPayload.message.order.id = order_id;
  existingPayload.message.order.status = "ACTIVE";
  existingPayload.message.order.payments = sessionData.payments;
  const now = new Date().toISOString();
  existingPayload.message.order.created_at = existingPayload.context.timestamp;
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;

  // UPDATE SETTLEMENT AMOUNT BASED ON QUOTE PRICE
  if (existingPayload.message.order.tags) {
    existingPayload.message.order.tags = updateSettlementAmount(
      existingPayload.message.order.tags,
      sessionData.quote
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
