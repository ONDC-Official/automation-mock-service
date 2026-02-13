export async function confirmDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  // Get quote total for payment amount calculation
  const quoteTotal = parseFloat(sessionData?.on_init_quote?.price?.value || "0");
  const quoteCurrency = sessionData?.on_init_quote?.price?.currency || "INR";

  const payments =
    sessionData?.on_init_payments?.[0]?.map((payment: any) => {
      let updatedPayment = { ...payment };
      
      // Update status based on type
      if (payment.type === "PRE-ORDER") {
        updatedPayment.status = "PAID";
        
        // Update params.amount from quote
        if (updatedPayment.params && quoteTotal > 0) {
          // For split payments, calculate based on payment type tags
          if (payment.tags) {
            const advDepositTag = payment.tags.find((t: any) => 
              t.descriptor?.code === "ADV-DEPOSIT"
            );
            if (advDepositTag) {
              // Advance deposit - use amount from quote or keep existing
              updatedPayment.params.amount = payment.params?.amount || quoteTotal.toFixed(2);
            }
          } else {
            // Single PRE-ORDER payment - use full quote amount
            updatedPayment.params.amount = quoteTotal.toFixed(2);
          }
          updatedPayment.params.currency = quoteCurrency;
        }
      } else if (payment.type === "ON-FULFILLMENT" || payment.type === "PART-PAYMENT") {
        updatedPayment.status = "NOT-PAID";
        
        // Calculate remaining amount for ON-FULFILLMENT
        if (updatedPayment.params && quoteTotal > 0) {
          const preOrderPayments = (sessionData?.on_init_payments?.[0] || [])
            .filter((p: any) => p.type === "PRE-ORDER");
          
          const paidAmount = preOrderPayments.reduce((sum: number, p: any) => 
            sum + parseFloat(p.params?.amount || "0"), 0);
          
          const remainingAmount = quoteTotal - paidAmount;
          updatedPayment.params.amount = remainingAmount.toFixed(2);
          updatedPayment.params.currency = quoteCurrency;
        }
      }
      
      return updatedPayment;
    }) ?? [];

  existingPayload.message.order.payments = payments;

  existingPayload.message.order.provider.id =
    sessionData?.on_init_provider_id ?? "P1";
  
  // Remove provider.tags as per ONDC spec (not needed in confirm)
  delete existingPayload.message.order.provider.tags;
  
  existingPayload.message.order.items = sessionData?.on_init_items[0] ?? [];
  existingPayload.message.order.quote = sessionData?.on_init_quote ?? {};
  existingPayload.message.order.billing = sessionData?.on_init_billing ?? {};
  existingPayload.message.order.fulfillments =
    sessionData?.on_init_fulfillments[0] ?? [];
  existingPayload.message.order.tags = sessionData?.on_init_tags[0] ?? [];

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
