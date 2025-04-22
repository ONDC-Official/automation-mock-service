import { SessionData } from "../../../session-types";

function enrichQuote(existingQuote: any) {
  return {
    ...existingQuote,
    price: {
      ...existingQuote.price,
      value: parseFloat(existingQuote.price.value).toFixed(2)
    },
    breakup: existingQuote.breakup.map((entry: any) => ({
      ...entry,
      price: {
        ...entry.price,
        value: parseFloat(entry.price.value).toFixed(2)
      }
    }))
  };
}

export const onSelectGenerator = (
  existingPayload: any,
  sessionData: SessionData
) => {
  const order = existingPayload.message.order;

  if (Array.isArray(order.fulfillments)) {
    order.fulfillments = order.fulfillments.map((f: any) => ({
      ...f,
      tracking: f.tracking ?? false
    }));
  }

  order.quote = enrichQuote(order.quote);

  return existingPayload;
};
