export async function onStatusTechnicalCancellationGenerator(existingPayload: any, sessionData: any) {
  existingPayload.message.order.id = sessionData?.on_confirm_orderID ?? "01";
  existingPayload.message.order.status = "ACTIVE";
  return existingPayload;
}