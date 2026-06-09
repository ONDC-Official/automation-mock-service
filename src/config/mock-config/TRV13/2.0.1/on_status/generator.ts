export async function onStatusDefaultGenerator(
  existingPayload: any,
  sessionData: any,
  isCityCode?: boolean
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

  const payments =
    sessionData?.on_confirm_payments?.flat()?.map((item: any) => {
      if (item.type === "ON-FULFILLMENT") {
        return {
          ...item,
          status: "PAID",
          time: {
            timestamp:
              sessionData?.context?.timestamp ?? new Date().toISOString(),
          },
          params: {
            ...item.params,
            transaction_id: Math.floor(
              Math.random() * 900000000 + 100000000,
            ).toString(),
          }
        };
      } else {
        return {
          ...item,
          status: "PAID",
        };
      }
    }) ?? [];

  existingPayload.message.order.id = sessionData?.on_confirm_orderID ?? "01";
  existingPayload.message.order.status = isCityCode ? "COMPLETED" : "ACTIVE";
  existingPayload.message.order.payments = payments;

  existingPayload.message.order.provider.id =
    sessionData?.confirm_provider_id ?? "P1";
  existingPayload.message.order.items = sessionData?.confirm_items?.flat() ?? [];
  existingPayload.message.order.quote = sessionData?.confirm_quote ?? {};
  existingPayload.message.order.billing = sessionData?.confirm_billing ?? {};
  existingPayload.message.order.fulfillments =
    sessionData?.confirm_fulfillments?.flat() ?? [];
  existingPayload.message.order.tags = sessionData?.confirm_tags?.flat() ?? [];
  existingPayload.message.order.cancellation_terms =
    sessionData?.on_select_cancellation_terms?.flat() ?? [];
  existingPayload.message.order.provider.tags =
    sessionData?.on_select_provider_tags?.flat() ?? [];
  existingPayload.message.order.items[0].tags =
    sessionData?.on_select_item_tags?.flat() ?? [];
  existingPayload.message.order.updated_at =
    sessionData?.context?.timestamp ?? new Date().toISOString();
  return existingPayload;
}
