export async function confirmDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {

  existingPayload.message.order.status = "COMPLETE";

  // Use on_confirm payments (BPP output) — all PAID at update/completion stage
  // pymnt-5 (ON-FULFILLMENT) additionally gets a time.timestamp
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
        };
      }
      return { ...item, status: "PAID" };
    }) ?? [];
  existingPayload.message.order.payments = payments;

  existingPayload.message.order.id = sessionData?.on_confirm_orderID ?? "01";
  existingPayload.message.order.provider.id =
    sessionData?.confirm_provider_id ?? "P1";
  existingPayload.message.order.items = sessionData?.confirm_items?.flat() ?? [];
  existingPayload.message.order.quote = sessionData?.confirm_quote ?? {};
  existingPayload.message.order.billing = sessionData?.confirm_billing ?? {};
  existingPayload.message.order.fulfillments =
    sessionData?.confirm_fulfillments?.flat() ?? [];
  existingPayload.message.order.documents =
    sessionData?.on_status_order_documents?.flat() ?? [];
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
