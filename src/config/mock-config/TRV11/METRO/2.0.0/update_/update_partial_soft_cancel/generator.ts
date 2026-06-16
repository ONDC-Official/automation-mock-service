import { SessionData } from "../../../../session-types";


export async function UpdatePartialSoftCancelGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  console.log(`sesssion data in updatePortal : ${JSON.stringify(sessionData)}`)
  const cancelledFulfillment =
    Array.isArray(sessionData.fulfillments)
      ? sessionData.fulfillments[0] // F2
      : sessionData.fulfillments;

  existingPayload.message = {
    update_target: "order.fulfillments",
    order: {
      id: sessionData.order_id || existingPayload.message?.order?.id || "077b248f",
      fulfillments: [
        {
          id: cancelledFulfillment?.id || "F2",
          type: cancelledFulfillment?.type || "TRIP",
        },
      ],
      cancellation: {
        reason: {
          id: "001",
          descriptor: {
            code: "SOFT_CANCEL",
          },
        },
      },
    },
  };

  return existingPayload;
}
