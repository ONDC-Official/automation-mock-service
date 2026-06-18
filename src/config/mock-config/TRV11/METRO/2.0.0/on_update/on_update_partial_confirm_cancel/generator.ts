export async function onUpdateConfirmPartialCancelGenerator(
  existingPayload: any,
  sessionData: any
) {
  // Deep copy to prevent modifying the session data directly
  if (sessionData?.on_update_first) {
    existingPayload.message.order = JSON.parse(JSON.stringify(sessionData.on_update_first));
  }

  if (existingPayload.message?.order) {
    existingPayload.message.order.status = "ACTIVE";

    const fulfillmentToRemoveId = sessionData?.update_fulfillment?.[0]?.id;
    if (fulfillmentToRemoveId && Array.isArray(existingPayload.message.order.fulfillments)) {
      existingPayload.message.order.fulfillments = existingPayload.message.order.fulfillments.map((fulfillment: any) => {
        if (fulfillment.id === fulfillmentToRemoveId) {
          return {
            ...fulfillment,
            state: {
              descriptor: {
                code: "CANCELLED"
              }
            }
          };
        }
        return fulfillment;
      });
    }
  }
  if (sessionData.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }
  const now = new Date().toISOString();
    existingPayload.message.order.updated_at = now

  return existingPayload;
}