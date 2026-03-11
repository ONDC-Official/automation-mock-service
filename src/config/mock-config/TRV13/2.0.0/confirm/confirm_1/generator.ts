import { v4 as uuidv4 } from "uuid";

export async function confirmDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  const payments =
    sessionData?.on_init_payments?.flat().map((payment: any) => {
      if (payment.type === "PRE-ORDER") {
        return {
          ...payment,
          status: "PAID",
          params: {
            ...payment.params,
            transaction_id: `payment-utr-${uuidv4().slice(0, 8)}`
          }
        };
      } else {
        return { ...payment, status: "NOT-PAID" };
      }
    }) ?? [];

  existingPayload.message.order.payments = payments;

  existingPayload.message.order.provider.id =
    sessionData?.on_init_provider_id ?? "P1";
  existingPayload.message.order.items = sessionData?.on_init_items.flat() ?? [];
  existingPayload.message.order.quote = sessionData?.on_init_quote ?? {};
  existingPayload.message.order.billing = sessionData?.on_init_billing ?? {};
  existingPayload.message.order.fulfillments =
    sessionData?.on_init_fulfillments.flat() ?? [];
  existingPayload.message.order.tags = sessionData?.on_init_tags.flat() ?? [];

  existingPayload.message.order.created_at =
    sessionData?.context?.timestamp ?? new Date().toISOString();
  existingPayload.message.order.updated_at =
    sessionData?.context?.timestamp ?? new Date().toISOString();
  return existingPayload;
}

/**
 * Confirm Generator for TRV14
 *
 * Logic:
 * 1. Load fields from session: items, fulfillments, provider, billing, tags
 * 2. Update payments with transaction_id and amount from session
 * 3. Payments structure comes pre-injected from default.yaml
 */

// export async function confirmDefaultGenerator(existingPayload: any, sessionData: any) {
//   // Load items from session
//   if (sessionData.selected_items) {
//     existingPayload.message.order.items = sessionData.selected_items;
//   }

//   // Load fulfillments from session
//   if (sessionData.selected_fulfillments) {
//     existingPayload.message.order.fulfillments = sessionData.selected_fulfillments;
//   }

//   // Load provider from session
//   if (sessionData.selected_provider) {
//     existingPayload.message.order.provider = sessionData.selected_provider;
//   }

//   // Load billing from session
//   if (sessionData.billing) {
//     existingPayload.message.order.billing = sessionData.billing;
//   }

//   // Load tags from session (BAP_TERMS and BPP_TERMS)
//   if (sessionData.tags) {
//     existingPayload.message.order.tags = sessionData.tags;
//   }

//   // Update payments with transaction_id and amount from session
//   if (existingPayload.message.order.payments && Array.isArray(existingPayload.message.order.payments)) {
//     existingPayload.message.order.payments.forEach((payment: any) => {
//       if (payment.params) {
//         // Update transaction_id from session
//         if (sessionData.transaction_id) {
//           payment.params.transaction_id = sessionData.transaction_id;
//         }

//         // Update amount from session quote
//         if (sessionData.quote && sessionData.quote.price && sessionData.quote.price.value) {
//           payment.params.amount = sessionData.quote.price.value;
//           payment.params.currency = sessionData.quote.price.currency || "INR";
//         }
//       }
//     });
//   }

//   return existingPayload;
// }
