export async function onCancelDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  existingPayload.message.order.id = sessionData?.on_confirm_orderID ?? "01";
  existingPayload.message.order.status = "CANCELLED";

  existingPayload.message.order.cancellation.reason.id =
    sessionData?.cancel_reason_id ?? "001";
  existingPayload.message.order.cancellation.cancelled_by = "CONSUMER";
  existingPayload.message.order.cancellation.reason.descriptor =
    sessionData?.cancel_descrioptor ?? {
      short_desc: "No more required",
      long_desc: "Hotel available at lower price",
    };

  existingPayload.message.order.updated_at =
    sessionData?.context?.timestamp ?? new Date().toISOString();
  return existingPayload;
}

