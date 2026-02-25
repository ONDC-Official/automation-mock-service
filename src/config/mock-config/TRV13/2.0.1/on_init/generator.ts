export async function onInitDefaultGenerator(
  existingPayload: any,
  sessionData: any
) {
  const payments =
    sessionData?.init_payments?.flat().map((payment: any) => {
      return { ...payment, status: "NOT-PAID" };
    }) ?? [];
  existingPayload.message.order.provider.id =
    sessionData?.init_provider_id ?? "P1";
  existingPayload.message.order.items = sessionData?.init_items?.flat() ?? [];
  existingPayload.message.order.quote = sessionData?.select_quote ?? {};
  existingPayload.message.order.payments = payments ?? [];
  existingPayload.message.order.billing = sessionData?.init_billing ?? {};
  existingPayload.message.order.fulfillments =
    sessionData?.init_fulfillments?.flat() ?? [];
  existingPayload.message.order.tags = [
    ...(sessionData?.init_tags?.flat() ?? []),
    {
      descriptor: {
        code: "BPP_TERMS",
      },
      list: [
        {
          descriptor: {
            code: "MAX_LIABILITY",
          },
          value: "2",
        },
        {
          descriptor: {
            code: "MAX_LIABILITY_CAP",
          },
          value: "1000.00",
        },
        {
          descriptor: {
            code: "MANDATORY_ARBITRATION",
          },
          value: "false",
        },
        {
          descriptor: {
            code: "COURT_JURISDICTION",
          },
          value: "New Delhi",
        },
        {
          descriptor: {
            code: "DELAY_INTEREST",
          },
          value: "5",
        },
        {
          descriptor: {
            code: "TAX_NUMBER",
          },
          value: "GST_NUMBER_SELLERNP",
        },
      ],
    },
  ];
  existingPayload.message.order.cancellation_terms =
    sessionData?.on_select_cancellation_terms?.flat() ?? [];
  existingPayload.message.order.provider.tags =
    sessionData?.on_select_provider_tags?.flat() ?? [];
  existingPayload.message.order.items[0].tags =
    sessionData?.on_select_item_tags?.flat() ?? [];
  return existingPayload;
}

/**
 * On_Init Generator for TRV14
 *
 * Logic:
 * 1. Reuse data from session: items, fulfillments, provider, quote, cancellation_terms, replacement_terms, payments, billing, tags
 * 2. Combine bpp_terms and bap_terms from session into tags array
 * 3. No xinput injection needed for on_init
 */

// export async function onInitDefaultGenerator(existingPayload: any, sessionData: any) {
//   // Reuse data from session (same as on_select_2)
//   if (sessionData.items) {
//     existingPayload.message.order.items = sessionData.items;
//   }

//   if (sessionData.fulfillments) {
//     existingPayload.message.order.fulfillments = sessionData.fulfillments;
//   }

//   if (sessionData.provider) {
//     existingPayload.message.order.provider = sessionData.provider;
//   }

//   if (sessionData.quote) {
//     existingPayload.message.order.quote = sessionData.quote;
//   }

//   if (sessionData.cancellation_terms) {
//     existingPayload.message.order.cancellation_terms = sessionData.cancellation_terms[0];
//   }

//   if (sessionData.replacement_terms) {
//     existingPayload.message.order.replacement_terms = sessionData.replacement_terms[0];
//   }

//   if (sessionData.payments) {
//     existingPayload.message.order.payments = sessionData.payments;
//   }

//   if (sessionData.billing) {
//     existingPayload.message.order.billing = sessionData.billing;
//   }

//   // Combine bpp_terms and bap_terms from session into tags array
//   const tags = [] as any;

//   // Add BPP Terms structure
//   const bppTerms = {
//     "descriptor": {
//       "code": "BPP_TERMS",
//       "name": "BPP Terms of Engagement"
//     },
//     "display": false,
//     "list": [
//       {
//         "descriptor": {
//           "code": "BUYER_FINDER_FEES_PERCENTAGE"
//         },
//         "value": "1"
//       },
//       {
//         "descriptor": {
//           "code": "BUYER_FINDER_FEES_TYPE"
//         },
//         "value": "percent"
//       },
//       {
//         "descriptor": {
//           "code": "STATIC_TERMS"
//         },
//         "value": "https://api.example-bap.com/booking/terms"
//       },
//       {
//         "descriptor": {
//           "code": "MANDATORY_ARBITRATION"
//         },
//         "value": "true"
//       },
//       {
//         "descriptor": {
//           "code": "COURT_JURISDICTION"
//         },
//         "value": "std:011"
//       },
//       {
//         "descriptor": {
//           "code": "DELAY_INTEREST"
//         },
//         "value": "2.5 %"
//       },
//       {
//         "descriptor": {
//           "code": "SETTLEMENT_AMOUNT"
//         },
//         "value": "7 INR"
//       },
//       {
//         "descriptor": {
//           "code": "SETTLEMENT_TYPE"
//         },
//         "value": "upi"
//       },
//       {
//         "descriptor": {
//           "code": "SETTLEMENT_BANK_CODE"
//         },
//         "value": "XXXXXXXX"
//       },
//       {
//         "descriptor": {
//           "code": "SETTLEMENT_BANK_ACCOUNT_NUMBER"
//         },
//         "value": "xxxxxxxxxxxxxx"
//       }
//     ]
//   };

//   tags.push(bppTerms);

//   // Add BAP Terms from session if available
//   if (sessionData.bap_terms) {
//     tags.push(sessionData.bap_terms);
//   }

//   // Set the combined tags array
//   if (tags.length > 0) {
//     existingPayload.message.order.tags = tags;
//   }

//   return existingPayload;
// }
