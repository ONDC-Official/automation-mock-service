import { SessionData } from "../../../../session-types";
import { createFulfillments } from "../../api-objects/fulfillments";
import { createGenericOnStatus } from "../on_status_packed/generator";

export async function on_status_self_pickup_picked_generator(
    existingPayload: any,
    sessionData: SessionData
) {
    const generalPayload = createGenericOnStatus(existingPayload, sessionData);
    generalPayload.message.order.state = "Completed"
    generalPayload.message.order.fulfillments[0] = {
        ...sessionData.fulfillments[0],
        start: {
          instructions: {
            code: "2",
            name: "ONDC order",
            short_desc: "value of PCC"
          },
          timestamp: new Date().toISOString()
        },
        state: {
          descriptor: {
            code: "Picked-Up"
          }
        }
      }
    return generalPayload;
}
