export async function onCancelConfirmTechnicalCancellationGenerator(existingPayload: any, sessionData: any) {

  if(sessionData.order){
    existingPayload.message.order = sessionData.order;
  }
  existingPayload.message.status = "CANCELLED";

  return existingPayload;
} 