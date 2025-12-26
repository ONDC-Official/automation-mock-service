export async function cancelDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  // existingPayload.message.order_id = sessionData?.on_confirm_orderID ?? "01";
  return existingPayload;
}
