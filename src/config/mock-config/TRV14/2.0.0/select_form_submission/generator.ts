export async function select2Generator(existingPayload: any, sessionData: any) {
  // Replace the entire items array with sessionData.items if available, then inject xinput into each item
  if (
    existingPayload &&
    existingPayload.message &&
    existingPayload.message.order
  ) {
    if (Array.isArray(sessionData.selected_items)) {
      existingPayload.message.order.items = sessionData.selected_items.map((item: any) => ({
        ...item,
        xinput: {
          form: {
            id: "F01"
          },
          form_response: {
            status: "SUCCESS",
            submission_id: "F01_SUBMISSION_ID"
          }
        }
      }));
    }
    if (sessionData.selected_provider) {
      existingPayload.message.order.provider = sessionData.selected_provider;
    }
    if(sessionData.selected_fulfillments){
      existingPayload.message.order.fulfillments = sessionData.selected_fulfillments;
    }
  }
  return existingPayload;
} 