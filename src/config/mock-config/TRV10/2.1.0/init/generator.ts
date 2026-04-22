import { SessionData } from "../../session-types";

const customer = {
  contact: {
    phone: "9876556789",
  },
  person: {
    name: "Joe Adams",
  },
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

export async function initGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.message.order.fulfillments =
    sessionData.selected_fulfillments;
  existingPayload.message.order.fulfillments[0]["customer"] = {
    contact: {
      phone: "9876556789",
    },
    person: {
      name: "Joe Adams",
    },
  };
  delete existingPayload.message.order.fulfillments[0].type;
  // UPDATE SETTLEMENT AMOUNT BASED ON QUOTE PRICE
  // if (existingPayload.message.order.tags) {
  //   existingPayload.message.order.tags = updateSettlementAmount(
  //     existingPayload.message.order.tags,
  //     sessionData.quote
  //   );
  // }
  const searchTags = (sessionData as any).search_tags?.flat() ?? [];

  const bapTerms = searchTags.find(
    (tag: any) => tag?.descriptor?.code === "BAP_TERMS",
  );

  const bapList: any[] = bapTerms?.list ?? [];

  const onSearchTags = (sessionData as any).on_search_tags?.flat() ?? [];

  const onSearchBapTerms = onSearchTags.find(
    (tag: any) => tag?.descriptor?.code === "BAP_TERMS",
  );

  const onSearchList: any[] = onSearchBapTerms?.list ?? [];

  const baseList = [
    { descriptor: { code: "BUYER_FINDER_FEES_PERCENTAGE" }, value: "1" },
    { descriptor: { code: "SETTLEMENT_WINDOW" }, value: "PT60M" },
    { descriptor: { code: "SETTLEMENT_BASIS" }, value: "DELIVERY" },
    { descriptor: { code: "SETTLEMENT_TYPE" }, value: "UPI" },
    { descriptor: { code: "SETTLEMENT_AMOUNT" }, value: "1.46" },
    { descriptor: { code: "MANDATORY_ARBITRATION" }, value: "true" },
    { descriptor: { code: "COURT_JURISDICTION" }, value: "New Delhi" },
    { descriptor: { code: "DELAY_INTEREST" }, value: "5" },
    {
      descriptor: { code: "STATIC_TERMS" },
      value: "https://example-test-bpp.com/static-terms.txt",
    },
  ];

  const overrideList = [
    { descriptor: { code: "SETTLEMENT_BANK_CODE" }, value: "XXXXXXXXX" },
    {
      descriptor: { code: "SETTLEMENT_BANK_ACCOUNT_NUMBER" },
      value: "xxxxxxxxxxxxxx",
    },
    {
      descriptor: { code: "SETTLEMENT_VIRTUAL_PAYMENT_ADDRESS" },
      value: "9988199772@okicic",
    },
  ];

  const map = new Map<string, any>();

  [...baseList, ...onSearchList, ...bapList, ...overrideList].forEach(
    (item) => {
      const code = item?.descriptor?.code;
      if (code) {
        map.set(code, item);
      }
    },
  );

  const quotePrice = Number(sessionData.quote?.price?.value ?? 0);
  const buyerFeePercentage = Number(
    map.get("BUYER_FINDER_FEES_PERCENTAGE")?.value ?? 1,
  );
  const feeAmount = (quotePrice / 100) * buyerFeePercentage;
  const settlementAmount = (
    sessionData.collected_by === "BAP" ? quotePrice - feeAmount : feeAmount
  ).toFixed(2);

  map.set("SETTLEMENT_AMOUNT", {
    descriptor: { code: "SETTLEMENT_AMOUNT" },
    value: settlementAmount,
  });

  const finalList = Array.from(map.values());

  existingPayload.message.order.tags = [
    {
      descriptor: {
        code: "BAP_TERMS",
        name: "BAP Terms of Engagement",
      },
      display: false,
      list: finalList,
    },
  ];
  existingPayload.message.order.items[0] = {
    id: sessionData.selected_item_id,
  };
  return existingPayload;
}
