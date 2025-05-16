import { SessionData } from "../../../../session-types";
function transformFulfillments(fulfillments: any[]): any[] {
    const generateTicketNumber = () => {
      return Math.floor(Math.random() * 0xffffffff)
        .toString(16)
        .padStart(8, "0");
    };
  
    return fulfillments.map((fulfillment) => {
      if (fulfillment.type === "TRIP") {
        return {
          ...fulfillment,
          state: {
            descriptor: {
              code: "ACTIVE"
            }
          }
        };
      }
  
      if (fulfillment.type === "TICKET") {
        const updatedStops = Array.isArray(fulfillment.stops)
          ? fulfillment.stops.map((stop: any) => {
              if (stop.authorization) {
                return {
                  ...stop,
                  authorization: {
                    ...stop.authorization,
                    status: "CLAIMED"
                  }
                };
              }
              return stop;
            })
          : fulfillment.stops;
  
        const ticketNumber = generateTicketNumber();
  
        const updatedTags = Array.isArray(fulfillment.tags) ? [...fulfillment.tags] : [];
  
        const ticketInfoTagIndex = updatedTags.findIndex(
          (tag) => tag.descriptor?.code === "TICKET_INFO"
        );
  
        const ticketInfoEntry = {
          descriptor: {
            code: "NUMBER"
          },
          value: ticketNumber
        };
  
        if (ticketInfoTagIndex !== -1) {
          updatedTags[ticketInfoTagIndex].list = [
            ...(updatedTags[ticketInfoTagIndex].list || []),
            ticketInfoEntry
          ];
        } else {
          updatedTags.push({
            descriptor: {
              code: "TICKET_INFO"
            },
            list: [ticketInfoEntry]
          });
        }
  
        return {
          ...fulfillment,
          stops: updatedStops,
          tags: updatedTags
        };
      }
  
      return fulfillment;
    });
  }
  
  
  
export async function onUpdateVehConGenerator(existingPayload: any,sessionData: SessionData){
  if (sessionData.updated_payments.length > 0) {
        existingPayload.message.order.payments = sessionData.updated_payments;
      }
    
    if (sessionData.items.length > 0) {
    existingPayload.message.order.items = sessionData.items;
    }

    if (sessionData.fulfillments.length > 0) {
    existingPayload.message.order.fulfillments = sessionData.fulfillments;
    existingPayload.message.order.fulfillments = transformFulfillments(existingPayload.message.order.fulfillments)
    }
    if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
    }
    const now = new Date().toISOString();
    existingPayload.message.order.created_at = sessionData.created_at
    existingPayload.message.order.updated_at = now
    return existingPayload;
}