import { v4 as uuidv4 } from "uuid";
export async function onConfirmDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  existingPayload.message.order.id = sessionData?.provider_id ?? "P1";
  existingPayload.message.order.id = String("ORDER_ID-" + uuidv4().slice(0, 8));
  existingPayload.message.order.status = "ACTIVE";

  // Build correct 3-payment structure from on_init_payments:
  // pymnt-3 (PART-PAYMENT): NOT-PAID, pymnt-4 (PRE-ORDER/ADV): PAID + transaction_id, pymnt-5 (ON-FULFILLMENT): NOT-PAID
  const onInitPayments: any[] = sessionData?.on_init_payments?.flat() ?? [];
  const confirmPayments: any[] = sessionData?.confirm_payments?.flat() ?? [];
  const txnId =
    confirmPayments.find((p: any) => p.params?.transaction_id)?.params
      ?.transaction_id ?? "payment-utr-1234";

  existingPayload.message.order.payments = onInitPayments.map((p: any) => {
    if (p.type === "PRE-ORDER") {
      return {
        ...p,
        status: "PAID",
        params: {
          ...p.params,
          amount:
            p.params?.amount && parseFloat(p.params.amount) > 0
              ? p.params.amount
              : "2000.00", // fallback to on_init default amount
          transaction_id: txnId,
        },
      };
    }
    return { ...p, status: "NOT-PAID" };
  });

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

/**
 * On_Confirm Generator for TRV14
 *
 * Logic:
 * 1. Load most fields from session (items, fulfillments, provider, billing, payments, tags, etc.)
 * 2. Add order ID (UUID)
 * 3. Add hardcoded order status and fulfillment state
 * 4. Add authorization with QR token (UUID) and +5 days validity
 * 5. Add created_at and updated_at from session
 */

// import { v4 as uuidv4 } from "uuid";

// export async function onConfirmDefaultGenerator(
//   existingPayload: any,
//   sessionData: any
// ) {
//   console.log(`UPDATE PARTIAL CANCELLATION -- existingPayload`);
//   console.dir(existingPayload, { depht: null });
//   // Load items from session
//   if (sessionData.items) {
//     existingPayload.message.order.items = sessionData.items;
//   }

//   // Load fulfillments from session and add state + authorization
//   if (sessionData.fulfillments) {
//     existingPayload.message.order.fulfillments = sessionData.fulfillments;

//     // Add fulfillment state and authorization
//     if (Array.isArray(existingPayload.message.order.fulfillments)) {
//       existingPayload.message.order.fulfillments.forEach((fulfillment: any) => {
//         // Add hardcoded fulfillment state
//         fulfillment.state = {
//           descriptor: {
//             code: "CONFIRMED",
//           },
//         };

//         // Add authorization with QR token and +5 days validity
//         if (Array.isArray(fulfillment.stops)) {
//           fulfillment.stops.forEach((stop: any) => {
//             if (stop.type === "START") {
//               // Calculate +5 days from current timestamp
//               const currentTime = new Date(stop.time?.timestamp || new Date());
//               const validTo = new Date(
//                 currentTime.getTime() + 5 * 24 * 60 * 60 * 1000
//               ); // +5 days

//               stop.authorization = {
//                 type: "QR",
//                 token: uuidv4().replace(/-/g, ""), // UUID without dashes for QR token
//                 valid_to: validTo.toISOString(),
//                 status: "UNCLAIMED",
//               };
//             }
//           });
//         }
//       });
//     }
//   }

//   // Load provider from session
//   if (sessionData.provider) {
//     existingPayload.message.order.provider = sessionData.provider;
//   }

//   // Load billing from session
//   if (sessionData.billing) {
//     existingPayload.message.order.billing = sessionData.billing;
//   }

//   // Load payments from session
//   if (sessionData.payments) {
//     existingPayload.message.order.payments = sessionData.payments;
//   }

//   // Load tags from session
//   if (sessionData.tags) {
//     existingPayload.message.order.tags = sessionData.tags;
//   }

//   // Load cancellation_terms from session
//   if (sessionData.cancellation_terms) {
//     existingPayload.message.order.cancellation_terms =
//       sessionData.cancellation_terms[0];
//   }

//   // Load replacement_terms from session
//   if (sessionData.replacement_terms) {
//     existingPayload.message.order.replacement_terms =
//       sessionData.replacement_terms[0];
//   }

//   // Load quote from session
//   if (sessionData.quote) {
//     existingPayload.message.order.quote = sessionData.quote;
//   }

//   // Add order ID (UUID)
//   existingPayload.message.order.id = uuidv4().substring(0, 8); // Short UUID for order ID

//   // Add hardcoded order status
//   existingPayload.message.order.status = "ACTIVE";

//   // Add created_at and updated_at from session
//   if (sessionData.created_at) {
//     existingPayload.message.order.created_at =
//       existingPayload.context.timestamp;
//   }

//   if (sessionData.updated_at) {
//     existingPayload.message.order.updated_at =
//       existingPayload.context.timestamp;
//   }

//   return existingPayload;
// }
