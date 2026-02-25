export async function confirmDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {

  existingPayload.message.order.status = "COMPLETED";

  // Use on_confirm payments (BPP output) — all PAID at update/completion stage
  // pymnt-5 (ON-FULFILLMENT) additionally gets a time.timestamp
  const payments =
    sessionData?.on_confirm_payments?.[0]?.map((item: any) => {
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
  existingPayload.message.order.items = sessionData?.confirm_items[0] ?? [];
  existingPayload.message.order.quote = sessionData?.confirm_quote ?? {};
  existingPayload.message.order.billing = sessionData?.confirm_billing ?? {};
  existingPayload.message.order.fulfillments =
    sessionData?.confirm_fulfillments[0] ?? [];
  existingPayload.message.order.documents =
    sessionData?.on_status_order_documents[0] ?? [];
  existingPayload.message.order.tags = sessionData?.confirm_tags[0] ?? [];
  existingPayload.message.order.updated_at =
    sessionData?.context?.timestamp ?? new Date().toISOString();
  return existingPayload;
}
