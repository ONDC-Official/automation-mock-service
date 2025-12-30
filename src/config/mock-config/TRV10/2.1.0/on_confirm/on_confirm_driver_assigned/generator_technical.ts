import { randomBytes } from "crypto";
import { SessionData } from "../../../session-types";

// Add at the top with other types
interface Agent {
  name?: string;
  phone?: string;
}

const agent = {
  contact: {
    phone: "9856798567",
  },
  person: {
    name: "Jason Roy",
  },
};
const vehicle = {
  category: "AUTO_RICKSHAW",
  variant: "AUTO_RICKSHAW",
  make: "Bajaj",
  model: "Compact RE",
  registration: "KA-01-AD-9876",
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
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function updateOrderTimestamps(payload: any) {
  const now = new Date().toISOString();
  if (payload.message.order) {
    payload.message.order.created_at = payload.context.timestamp;
    payload.message.order.updated_at = payload.context.timestamp;
  }
  return payload;
}

function updateFulfillmentWithDriverInfo(
  fulfillment: any,
  sessionData: SessionData
): void {
  // Set fulfillment state to RIDE_ASSIGNED
  fulfillment.state = {
    descriptor: {
      code: "RIDE_ASSIGNED",
    },
  };
  fulfillment.type = sessionData.selected_fulfillments[0].type;
  fulfillment.tags = sessionData.selected_fulfillments[0].tags;
  // Add OTP authorization to the first stop
  if (fulfillment.stops[0]) {
    fulfillment.stops[0].authorization = {
      type: "OTP",
      token: generateOTP(),
      valid_to: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes validity
      status: "UNCLAIMED",
    };
  }
}

export async function onConfirmGeneratorTechnical(
  existingPayload: any,
  sessionData: SessionData
) {
  const order_id = Math.random().toString(36).substring(2, 15);
  existingPayload.message.order.id = '01';

  // Update order status to ACTIVE
  existingPayload.message.order.status = "ACTIVE";

  if (existingPayload.message.order.fulfillments[0]["_EXTERNAL"]) {
    delete existingPayload.message.order.fulfillments[0]["_EXTERNAL"];
  }
  existingPayload.message.order.payments = sessionData.payments;
  if (existingPayload.message.order.payments[0]["_EXTERNAL"]) {
    delete existingPayload.message.order.payments[0]["_EXTERNAL"];
  }

  // Update fulfillments with driver information
  if (sessionData.fulfillments?.length > 0) {
    sessionData.fulfillments.forEach((fulfillment) => {
      updateFulfillmentWithDriverInfo(fulfillment, sessionData);
    });
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
    existingPayload.message.order.fulfillments[0]["state"] = {
      descriptor: { code: "RIDE_ASSIGNED" },
    };
    existingPayload.message.order.fulfillments[0]["agent"] = agent;
    existingPayload.message.order.fulfillments[0]["vehicle"] = vehicle;
  }

  // Update items if present
  if (sessionData.items?.length > 0) {
    existingPayload.message.order.items = sessionData.items;
  }

  // Update quote if present
  if (sessionData.quote) {
    existingPayload.message.order.quote = sessionData.quote;
  }

  // Update payments if present
  if (sessionData.updated_payments?.length > 0) {
    existingPayload.message.order.payments = sessionData.updated_payments;
  }

  // Add cancellation terms
  existingPayload.message.order.cancellation_terms = [
    {
      cancellation_fee: { percentage: "0" },
      fulfillment_state: { descriptor: { code: "RIDE_ASSIGNED" } },
      reason_required: true,
    },
    {
      cancellation_fee: { amount: { currency: "INR", value: "30" } },
      fulfillment_state: { descriptor: { code: "RIDE_ENROUTE_PICKUP" } },
      reason_required: true,
    },
    {
      cancellation_fee: { amount: { currency: "INR", value: "50" } },
      fulfillment_state: { descriptor: { code: "RIDE_ARRIVED_PICKUP" } },
      reason_required: true,
    },
    {
      cancellation_fee: { percentage: "100" },
      fulfillment_state: { descriptor: { code: "RIDE_STARTED" } },
      reason_required: true,
    },
  ];
  if (existingPayload.message.order.fulfillments[0]["_EXTERNAL"]) {
    delete existingPayload.message.order.fulfillments[0]["_EXTERNAL"];
  }
  existingPayload.message.order.payments = sessionData.payments;
  if (existingPayload.message.order.payments[0]["_EXTERNAL"]) {
    delete existingPayload.message.order.payments[0]["_EXTERNAL"];
  }
  // Update timestamps
  existingPayload = updateOrderTimestamps(existingPayload);
  existingPayload.message.order.fulfillments["type"] = "DELIVERY";
  if (existingPayload.message.order.fulfillments[0]["_EXTERNAL"]) {
    delete existingPayload.message.order.fulfillments[0]["_EXTERNAL"];
  }
  existingPayload.message.order.payments = sessionData.payments;
  if (existingPayload.message.order.payments[0]["_EXTERNAL"]) {
    delete existingPayload.message.order.payments[0]["_EXTERNAL"];
  }

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

  await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
  return existingPayload;
}
