import { SessionData } from "../../session-types";

type Price = {
  value: string;
  currency: string;
};

type Item = {
  id: string;
  price: Price;
  quantity?: {
    selected: {
      count: number;
    };
  };
};

type Breakup = {
  title: string;
  item?: Item;
  price: Price;
};

type Quote = {
  price: Price;
  breakup: Breakup[];
  ttl?: string;
};

function updateFulfillmentRouteTags(tags: any[]) {
  return tags.map((tag) => {
    if (tag.descriptor?.code === "ROUTE_INFO" && Array.isArray(tag.list)) {
      return {
        ...tag,
        list: tag.list.map((t: any) => {
          if (t.descriptor.code === "ENCODED_POLYLINE") {
            return { ...t, value: t.value + "R" };
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

function applyCancellationCharges(quote: Quote, state: string): Quote {
  // Get cancellation fee based on ride state
  const getCancellationFee = (state: string): number => {
    switch (state) {
      case "RIDE_ASSIGNED":
        return 0;
      case "RIDE_ENROUTE_PICKUP":
        return 30;
      case "RIDE_ARRIVED_PICKUP":
        return 50;
      case "RIDE_STARTED":
        return parseFloat(quote.price.value); // 100% of ride value
      default:
        return 0;
    }
  };

  const cancellationFee = getCancellationFee(state);
  const currentTotal = parseFloat(quote.price.value);

  // Create refund breakup for the base fare
  const refundBreakups: Breakup[] = quote.breakup.map((breakup) => ({
    title: "REFUND",
    price: {
      currency: breakup.price.currency,
      value: `-${breakup.price.value}`,
    },
  }));

  // Add cancellation charge breakup
  const cancellationBreakup: Breakup = {
    title: "CANCELLATION_CHARGES",
    price: {
      currency: "INR",
      value: cancellationFee.toFixed(2),
    },
  };

  // Calculate final amount (original - refund + cancellation charges)
  const finalAmount = cancellationFee;

  return {
    price: {
      value: finalAmount.toFixed(2),
      currency: "INR",
    },
    breakup: [...quote.breakup, ...refundBreakups, cancellationBreakup],
    ttl: "PT30S",
  };
}

export async function onUpdatePurpleTagsGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  // Update payments if present
  if (sessionData.updated_payments?.length > 0) {
    existingPayload.message.order.payments = sessionData.updated_payments;
  }

  // Update items if present
  if (sessionData.items?.length > 0) {
    existingPayload.message.order.items = sessionData.items;
  }

  // Ensure all fulfillments have the required 'type' property
  if (existingPayload.message.order.fulfillments?.length > 0) {
    existingPayload.message.order.fulfillments.forEach(
      (fulfillment: any, index: number) => {
        const selectedFulfillment = sessionData.selected_fulfillments[index];
        // Set default type to "DELIVERY" if not present
        if (!fulfillment.type) {
          fulfillment.type = "DELIVERY";
        }
        // Ensure type is one of the allowed values
        else if (!["DELIVERY", "SELF_PICKUP"].includes(fulfillment.type)) {
          fulfillment.type = "DELIVERY";
        }

        // Ensure vehicle registration is present
        if (!fulfillment.vehicle) {
          fulfillment.vehicle = {
            registration: "DL01AB1234",
          };
        } else if (!fulfillment.vehicle.registration) {
          fulfillment.vehicle.registration = "DL01AB1234";
        }

        if (
          selectedFulfillment.vehicle.make &&
          selectedFulfillment.vehicle.model
        ) {
          fulfillment.vehicle.make = selectedFulfillment.vehicle.make;
          fulfillment.vehicle.model = selectedFulfillment.vehicle.model;
        }

        // Valid ride states
        const validRideStates = [
          "RIDE_CANCELLED",
          "RIDE_ENDED",
          "RIDE_STARTED",
          "RIDE_ASSIGNED",
          "RIDE_ENROUTE_PICKUP",
          "RIDE_ARRIVED_PICKUP",
          "RIDE_CONFIRMED",
        ];

        fulfillment.stops = sessionData.selected_fulfillments[index].stops;
        fulfillment.id = sessionData.selected_fulfillments[index].id;
        fulfillment.state.descriptor.code = "RIDE_ENDED";

        // Ensure agent.person.name is present
        if (!fulfillment.agent) {
          fulfillment.agent = {
            person: {
              name: "Driver Name",
            },
            contact: {
              phone: "9876543210",
            },
          };

          //Assign ride & authorization if agent is being added
          fulfillment.state.descriptor.code = "RIDE_ASSIGNED";
          // Add OTP authorization to the first stop
        } else {
          if (!fulfillment.agent.person) {
            fulfillment.agent.person = {
              name: "Driver Name",
            };
          } else if (!fulfillment.agent.person.name) {
            fulfillment.agent.person.name = "Driver Name";
          }

          // Ensure agent.contact.phone is present
          if (!fulfillment.agent.contact) {
            fulfillment.agent.contact = {
              phone: "9876543210",
            };
          } else if (!fulfillment.agent.contact.phone) {
            fulfillment.agent.contact.phone = "9876543210";
          }
        }
      }
    );

    if (Array.isArray(existingPayload.message.order.fulfillments[0].tags)) {
      existingPayload.message.order.fulfillments[0].tags =
        updateFulfillmentRouteTags(
          existingPayload.message.order.fulfillments[0].tags
        );
    }
  }

  // Update order status if present
  if ("order_status" in sessionData) {
    existingPayload.message.order.status = sessionData.order_status;
  }

  // Handle cancellation and quote updates
  if ("cancellation" in sessionData) {
    const fulfillmentState =
      existingPayload.message.order.fulfillments[0]?.state?.descriptor?.code;
    if (fulfillmentState && existingPayload.message.order.quote){
      existingPayload.message.order.quote = applyCancellationCharges(
        existingPayload.message.order.quote,
        fulfillmentState
      );
    }
  } else if (sessionData.quote != null) {
    existingPayload.message.order.quote = sessionData.quote;
  }

  existingPayload.message.order.created_at = sessionData.created_at;
  existingPayload.message.order.id = sessionData.order_id;
  existingPayload.message.order.payments[0].id = sessionData.payments[0].id;

  // UPDATE SETTLEMENT AMOUNT BASED ON QUOTE PRICE
  // if (existingPayload.message.order.tags) {
  //   existingPayload.message.order.tags = updateSettlementAmount(
  //     existingPayload.message.order.tags,
  //     sessionData.quote
  //   );
  // }
  existingPayload.message.order.tags = (sessionData as any).confirm_tags?.flat();

  if (existingPayload.message.order.items?.length > 0) {
    existingPayload.message.order.items =
      existingPayload.message.order.items.map((item: any) => {
        if (Array.isArray(item.tags)) {
          item.tags = updateItemInfoTags(item.tags);
        }
        return item;
      });
  }

  // Update timestamps
  existingPayload.message.order.updated_at = new Date().toISOString();
  return existingPayload;
}
