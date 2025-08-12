export async function onCancelConfirmUserCancellationGenerator(existingPayload: any, sessionData: any) {
  if(sessionData.order){
    existingPayload.message.order = sessionData.order;
  }
  existingPayload.message.order.status = "CANCELLED";

  return existingPayload;} 