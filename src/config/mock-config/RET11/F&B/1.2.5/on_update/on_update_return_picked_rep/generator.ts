import { SessionData } from "../../../../session-types";
import { Quote, Fulfillment, Fulfillments } from "../../data";
import { v4 as uuid } from "uuid";

export async function on_update_picked_rep_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.message.order.id = sessionData.order_id;
  existingPayload.message.order.provider = sessionData.provider;
  existingPayload.message.order.items = sessionData.items;
  existingPayload.message.order.billing = sessionData.billing;
  existingPayload.message.order.payment = sessionData.payment;
  existingPayload.message.order.created_at = sessionData.confirm_created_at_timestamp;
  existingPayload.message.order.updated_at = existingPayload.context.timestamp;


  const deliveryFulfillment = existingPayload.message.order.fulfillments.find(
    (f: Fulfillment) => f.type == "Delivery"
  ) as Fulfillment;

  const returnItems: any = [];

  sessionData.fulfillments.forEach((fulfillment: any) => {
    if (fulfillment.tags && Array.isArray(fulfillment.tags)) {
      fulfillment.tags.forEach((tag: any) => {
        if (tag.code === "return_request" && Array.isArray(tag.list)) {
          const item: any = {};
          tag.list.forEach((entry: any) => {
            if (entry.code === "item_id") {
              item.item_id = entry.value;
            }
            if (entry.code === "item_quantity") {
              item.item_quantity = entry.value;
            }
          });
          if (item.item_id && item.item_quantity) {
            returnItems.push(item);
          }
        }
      });
    }
  });

  const items: any[] = sessionData.items;
  console.log('Items Before: ', sessionData.items);
  const fulfillments = sessionData.fulfillments as Fulfillments;
  const returnFulfillmentId = fulfillments.find(
    (f: Fulfillment) => f.type == "Return"
  )?.id;

  const replacementId = uuid();
  const replacementTag = {
    code: "replace_request",
    list: [
      {
        code: "id",
        value: replacementId,
      },
    ],
  };
  sessionData.replacementId = replacementId
  let sessionDataFulfillments = sessionData.fulfillments as Fulfillments;
  let replacementFulfillment: Fulfillment | undefined = undefined; // Store as object

  const tags = {
    tags: [
      {
        code: "routing",
        list: [
          {
            code: "type",
            value: "P2P",
          },
        ],
      },
      {
        code: "tracking",
        list: [
          {
            code: "gps_enabled",
            value: "no",
          },
          {
            code: "url_enabled",
            value: "yes",
          },
          {
            code: "url",
            value: "https://sellerNP.com/ondc/tracking_url",
          },
        ],
      },
    ],
  };

  if (sessionData?.on_status_fulfillments?.length >= 0) {
    const now = new Date();
    const startTime = new Date(now.getTime() + 10 * 60 * 1000);
    const endTime = new Date(
      startTime.getTime() + 10 * 60 * 1000
    ).toISOString();

    const deliveryFulfillment = sessionDataFulfillments.find(
      (f) => f.type === "Delivery"
    ) ;

    

    if (deliveryFulfillment) {
      replacementFulfillment = {
        ...deliveryFulfillment,
        start: {
          ...deliveryFulfillment.start,
          time: {
            range: {
              start: startTime.toISOString(),
              end: endTime,
            },
          },
        },
        end: {
          ...deliveryFulfillment.end,
          time: {
            range: {
              start: endTime,
              end: new Date(
                startTime.getTime() +
                  1000 *
                    isoDurToSec(deliveryFulfillment["@ondc/org/TAT"] || "PT0H")
              ).toISOString(),
            },
          },
        },
        tags: tags.tags,
      };
    }
  }
    console.log("replacementFulfillment", JSON.stringify(replacementFulfillment));
  replacementFulfillment = {
    ...replacementFulfillment,
    id: replacementId,
    state: {
      descriptor: {
        code: "Order-picked-up",
      },
    },
    type: "Delivery"
  };

  returnItems.forEach((retItem: any) => {
    const item = items.find((i: any) => i.id === retItem.item_id);
    if (item) {
      item.quantity.count -= parseInt(retItem.item_quantity, 10);
      if (item.quantity.count < 0) item.quantity.count = 0;
    }
  });

  const returnFulfillmentItems = returnItems.map((retItem: any) => ({
    id: retItem.item_id,
    fulfillment_id: returnFulfillmentId,
    quantity: { count: parseInt(retItem.item_quantity, 10) },
  }));

  const updatedItems = [...items, ...returnFulfillmentItems];

  console.log("updatedItems", updatedItems);

  existingPayload.message.order.items = updatedItems;

  const quote = sessionData.quote as Quote;
  const breakup = quote.breakup ?? [];

  const updatedBreakup = breakup.map((b: any) => {
    const retItem = returnItems.find(
      (r: any) => r.item_id === b["@ondc/org/item_id"]
    );
    if (retItem && b["@ondc/org/title_type"] === "item") {
      const newCount =
        parseInt(b["@ondc/org/item_quantity"]?.count, 10) -
        parseInt(retItem.item_quantity, 10);
      const itemPrice = parseFloat(b.item.price.value);
      const newValue = (newCount * itemPrice).toFixed(2);

      return {
        ...b,
        "@ondc/org/item_quantity": { count: newCount },
        price: { ...b.price, value: newValue },
      };
    }
    return b;
  });

  const totalValue = updatedBreakup
    .reduce((acc, b) => acc + parseFloat(b.price.value), 0)
    .toFixed(2);
  existingPayload.message.order.quote = {
    breakup: updatedBreakup,
    price: { currency: "INR", value: `${totalValue}` },
    ttl: "P1D",
  };

  const quoteTrails = returnItems.map((r: any) => {
    const orig: any = breakup.find(
      (b: any) => b["@ondc/org/item_id"] === r.item_id
    );
    const itemPrice = parseFloat(orig?.item.price.value);
    const value = (itemPrice * parseInt(r.item_quantity, 10)).toFixed(2);

    return {
      code: "quote_trail",
      list: [
        { code: "type", value: "item" },
        { code: "id", value: r.item_id },
        { code: "currency", value: "INR" },
        { code: "value", value: `-${value}` },
      ],
    };
  });
  existingPayload.message.order.fulfillments = sessionData.fulfillments.map(
    (f: Fulfillment) => {
      if (f.type == "Return") {
        const tags = f?.tags as any[];
        return {
          ...f,
          state: {
            descriptor: {
              code: "Return_Picked",
            },
          },
          start: {
            location: deliveryFulfillment.end?.location,
            time: {
              ...f.start?.time,
              timestamp: existingPayload.context.timestamp,
            },
          },
          tags: [...tags, replacementTag, ...quoteTrails],
        };
      }
      return f;
    }
  );
  sessionData.items = existingPayload.message.order.items;
  console.log('Items After: ', sessionData.items);
  
  
  existingPayload.message.order.fulfillments.push(replacementFulfillment);
  existingPayload.message.order.state = "Completed";
  return existingPayload;
}


export const isoDurToSec = (duration: string) => {
	const durRE =
		/P((\d+)Y)?((\d+)M)?((\d+)W)?((\d+)D)?T?((\d+)H)?((\d+)M)?((\d+)S)?/;

	const splitTime = durRE.exec(duration);
	if (!splitTime) {
		return 0;
	}

	const years = Number(splitTime?.[2]) || 0;
	const months = Number(splitTime?.[4]) || 0;
	const weeks = Number(splitTime?.[6]) || 0;
	const days = Number(splitTime?.[8]) || 0;
	const hours = Number(splitTime?.[10]) || 0;
	const minutes = Number(splitTime?.[12]) || 0;
	const seconds = Number(splitTime?.[14]) || 0;

	const result =
		years * 31536000 +
		months * 2628288 +
		weeks * 604800 +
		days * 86400 +
		hours * 3600 +
		minutes * 60 +
		seconds;

	return result;
};