import { SessionData } from "../../../../session-types";
import { createFulfillments } from "../../api-objects/fulfillments";
import { createGenericOnStatus } from "../../api-objects/on_status";

export async function on_status_rto_delivereddisposed_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  const generalPayload = createGenericOnStatus(existingPayload, sessionData);
  generalPayload.message.order.fulfillments = sessionData.fulfillments;
  const updatedFulfillments = generalPayload.message.order.fulfillments.map(
    (f: any) => {
      if (f.type === "RTO" && f.state?.descriptor?.code === "RTO-Initiated") {
        return {
          ...f,
          state: {
            ...f.state,
            descriptor: {
              ...f.state.descriptor,
              code: "RTO-Delivered",
            },
          },
          end: {
            ...f.end,
            time: {
              ...(f.end?.time || {}),
              timestamp:existingPayload.context.timestamp
            },
          },
        };
      }
      return f;
    }
  );

  generalPayload.message.order.fulfillments = updatedFulfillments;
  return existingPayload;
}
