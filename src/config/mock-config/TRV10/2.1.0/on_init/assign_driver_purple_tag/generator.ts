import { SessionData } from "../../../session-types";

type CancellationTerm = {
  cancellation_fee: {
    percentage?: string;
    amount?: {
      currency: string;
      value: string;
    };
  };
  fulfillment_state: {
    descriptor: {
      code: string;
    };
  };
  reason_required: boolean;
};

function updateSettlementAmount(terms: any[], quote: any) {
  const total = Number(quote?.price?.value || 0);

  terms.forEach((termBlock) => {
    if (!termBlock.list) return;

    const buyerFeeItem =
      termBlock.list.find(
        (i: any) => i.descriptor?.code === "BUYER_FINDER_FEES_PERCENTAGE"
      ) || 1;
    const settlementItem = termBlock.list.find(
      (i: any) => i.descriptor?.code === "SETTLEMENT_AMOUNT"
    );

    if (buyerFeeItem && settlementItem) {
      const percentage = Number(buyerFeeItem.value || 0);
      const settlementAmount = ((total * percentage) / 100).toFixed(2);
      settlementItem.value = settlementAmount;
    }
  });

  return terms;
}

export async function onInitGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  // Define cancellation terms based on different ride states
  const cancellationTerms: CancellationTerm[] = [
    {
      cancellation_fee: {
        percentage: "0",
      },
      fulfillment_state: {
        descriptor: {
          code: "RIDE_ASSIGNED",
        },
      },
      reason_required: true,
    },
    {
      cancellation_fee: {
        amount: {
          currency: "INR",
          value: "30",
        },
      },
      fulfillment_state: {
        descriptor: {
          code: "RIDE_ENROUTE_PICKUP",
        },
      },
      reason_required: true,
    },
    {
      cancellation_fee: {
        amount: {
          currency: "INR",
          value: "50",
        },
      },
      fulfillment_state: {
        descriptor: {
          code: "RIDE_ARRIVED_PICKUP",
        },
      },
      reason_required: true,
    },
    {
      cancellation_fee: {
        percentage: "100",
      },
      fulfillment_state: {
        descriptor: {
          code: "RIDE_STARTED",
        },
      },
      reason_required: true,
    },
  ];

  // Add cancellation terms to the order
  existingPayload.message.order.cancellation_terms = cancellationTerms;

  // Add disability tags if present in session data
  if (sessionData.items?.[0]) {
    const disabilityTag = {
      descriptor: {
        code: "DISABILITY_VIS",
        name: "Vision Impairment",
      },
      display: false,
      list: [
        {
          descriptor: {
            code: "VIS_LEVEL",
            name: "Level of Disability",
            short_desc: "Disability of Blind and low vision",
          },
          value: "LOW",
        },
        {
          descriptor: {
            code: "VIS_SCREEN_READER_USAGE",
            name: "Screen Reader Usage",
            short_desc: "Screen Reader Usage",
          },
          value: "JAWS",
        },
        {
          descriptor: {
            code: "VIS_CANE_USAGE",
            name: "Cane Usage",
            short_desc: "Cane Usage",
          },
          value: "Yes",
        },
      ],
    };

    // Add disability tag to items if not already present
    if (!existingPayload.message.order.items[0].tags) {
      existingPayload.message.order.items[0].tags = [];
    }
    existingPayload.message.order.items[0].tags.push(disabilityTag);
  }

  // UPDATE SETTLEMENT AMOUNT BASED ON QUOTE PRICE
  if (existingPayload.message.order.tags) {
    existingPayload.message.order.tags = updateSettlementAmount(
      existingPayload.message.order.tags,
      sessionData.quote
    );
  }

  return existingPayload;
}
