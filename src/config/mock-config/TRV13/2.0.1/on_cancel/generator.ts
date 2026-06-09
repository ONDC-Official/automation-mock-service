export async function onCancelDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  if (existingPayload.context) {
    existingPayload.context.bap_id = sessionData?.bap_id;
    existingPayload.context.bap_uri = sessionData?.bap_uri;
    existingPayload.context.bpp_id = sessionData?.bpp_id;
    existingPayload.context.bpp_uri = sessionData?.bpp_uri;
    if (existingPayload.context.location?.city) {
      existingPayload.context.location.city.code = sessionData?.city_code;
    }
  }
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

