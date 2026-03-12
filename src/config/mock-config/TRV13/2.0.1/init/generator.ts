export async function initDefaultGenerator(
  existingPayload: any,
  sessionData: any,
) {
  existingPayload.message.order.provider.id =
    sessionData?.select_provider_id ?? "P1";
  existingPayload.message.order.items = sessionData?.select_items[0] ?? [];
  // Use search_6_tags (from search_6) with fallback to search_5_tags
  existingPayload.message.order.tags =
    sessionData?.search_6_tags?.[0] ?? sessionData?.search_5_tags?.[0] ?? [];
  const hasTagCode = (payment: any, code: string) =>
    payment?.tags?.some((tag: any) => tag?.descriptor?.code === code);

  const allPayments: any[] = sessionData?.select_payments[0] ?? [];

  const preOrderPayment = allPayments.find(
    (p) => p.type === "PRE-ORDER" && hasTagCode(p, "ADV-DEPOSIT"),
  );
  const partPayment = allPayments.find((p) => p.type === "PART-PAYMENT");
  const onFulfillmentPayment = allPayments.find(
    (p) => p.type === "ON-FULFILLMENT" && hasTagCode(p, "FINAL-PAYMENT"),
  );

  let payments = [partPayment, preOrderPayment, onFulfillmentPayment].filter(
    Boolean,
  );

  if (onFulfillmentPayment) {
    onFulfillmentPayment.params = {
      ...onFulfillmentPayment.params,
      bank_code: "Bank Code of Buyer App",
      bank_account_number: "Bank Account Number of Buyer App",
      virtual_payment_address: "VPA of Buyer App",
    };
  }

  payments =
    payments?.map((payment: any) => {
      if (payment.type === "PART-PAYMENT")
        return { ...payment, status: "NOT-PAID" };
      else {
        return {
          ...payment,
          ...(payment?.type === "PRE-ORDER"
            ? { collected_by: "BAP" }
            : payment?.type === "ON-FULFILLMENT"
              ? { collected_by: "BPP" }
              : {}),
        };
      }
    }) ?? [];
  existingPayload.message.order.payments = payments;

  return existingPayload;
}

/**
 * Init Generator for TRV14
 *
 * Logic:
 * 1. Use same structure as select generator
 * 2. Pull data from session stored by select: selected_items, selected_fulfillments, selected_provider
 * 3. Update fulfillment timestamps to match context timestamp
 * 4. Add tags from session data
 */

// export async function initDefaultGenerator(existingPayload: any, sessionData: any) {
//   // Use selected items from session (stored by select)
//   if (sessionData.selected_items) {
//     existingPayload.message.order.items = sessionData.selected_items;
//   }

//   // Use selected fulfillments from session (stored by select)
//   if (sessionData.selected_fulfillments) {
//     existingPayload.message.order.fulfillments = sessionData.selected_fulfillments;
//   }

//   // Use selected provider from session (stored by select)
//   if (sessionData.selected_provider) {
//     existingPayload.message.order.provider = sessionData.selected_provider;
//   }

//   return existingPayload;
// }
