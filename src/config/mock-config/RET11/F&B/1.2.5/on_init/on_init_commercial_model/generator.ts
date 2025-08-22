import { buildRetailQuote } from "../../../../../../../utils/generic-utils";
import { SessionData } from "../../../../session-types";
import { on_search_items, on_search_offers } from "../../data";

type Price = {
  currency: string;
  value: string;
};

type TagEntry = {
  code: string;
  value: string;
};

type Tag = {
  code: string;
  list: TagEntry[];
};

type BreakupItem = {
  parent_item_id?: string;
  quantity?: {
    count: number;
  };
  tags?: Tag[];
};

type Breakup = {
  "@ondc/org/item_id"?: string;
  title: string;
  "@ondc/org/title_type": string;
  price: Price;
  item?: BreakupItem;
};

function getTagType(tags: Tag[]): string | undefined {
  const typeTag = tags.find((tag) => tag.code === "type");

  if (!typeTag) return undefined;

  const typeEntry = typeTag.list.find((entry) => entry.code === "type");

  return typeEntry?.value;
}

export async function onInitCommercialModelGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  const npFeesInput: string[] = sessionData.selected_np_fees || [];
  if (sessionData?.provider) {
    existingPayload.message.order.provider = sessionData.provider;
  }

  let isBuyerDelivery = false;

  existingPayload.message.order.fulfillments = sessionData.fulfillments?.map(
    (fulfillment: any) => {
      if (fulfillment.type === "Buyer-Delivery") {
        isBuyerDelivery = true;
        fulfillment.tags.push({
          code: "rto_action",
          list: [
            {
              code: "return_to_origin",
              value: "yes",
            },
          ],
        });
      }

      if (fulfillment.type === "Delivery") {
        fulfillment.tracking = true;
      } else {
        fulfillment.tracking = false;
      }

      return fulfillment;
    }
  );

  if (sessionData?.items) {
    if (!isBuyerDelivery) {
      existingPayload.message.order.items = sessionData.items.map((item) => {
        item.tags.push({
          code: "rto_action",
          list: [
            {
              code: "return_to_origin",
              value: "yes",
            },
          ],
        });

        return item;
      });
    } else {
      existingPayload.message.order.items = sessionData.items;
    }
  }

  if (sessionData?.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  existingPayload.message.order.quote = buildRetailQuote(
    existingPayload.message.order.items,
    on_search_items,
    existingPayload.message.order.fulfillments,
    {
      offers: sessionData?.offers,
      initalOffers: on_search_offers,
    }
  );

  const items = sessionData.items || [];
  const filteredBreakup: Breakup[] = [];

  items.forEach((item: any, index: number) => {
    const itemId = item.id;
    const allowedNpFeeId = npFeesInput[index];

    const relatedBreakups =
      existingPayload.message.order.quote.breakup.filter(
        (b: any) => b["@ondc/org/item_id"] === itemId
      );

    relatedBreakups.forEach((b: any) => {
      if (b["@ondc/org/title_type"] === "item") {
        if (b.item && b.item.quantity) delete b.item.quantity;
        filteredBreakup.push(b);
      } else {
        const npFeeTag = b.item?.tags?.find((t: any) => t.code === "np_fees");
        const feeId = npFeeTag?.list?.find((l: any) => l.code === "id")?.value;
        if (!feeId || feeId === allowedNpFeeId) {
          filteredBreakup.push(b);
        }
      }
    });
  });

  const fulfillmentBreakups =
    existingPayload.message.order.quote.breakup.filter(
      (b: any) => !items.some((it: any) => it.id === b["@ondc/org/item_id"])
    );

  existingPayload.message.order.quote.breakup = [
    ...filteredBreakup,
    ...fulfillmentBreakups,
  ];

  let total = 0;
  existingPayload.message.order.quote.breakup.forEach((b: any) => {
    const val = parseFloat(b.price?.value || "0");
    if (!isNaN(val)) total += val;
  });

  existingPayload.message.order.quote.price = {
    ...existingPayload.message.order.quote.price,
    value: total.toFixed(2),
  };


  existingPayload.message.order.tags = [
    {
      code: "bpp_terms",
      list: [
        {
          code: "tax_number",
          value: "12ABCDE3456FGZH",
        },
        {
          code: "provider_tax_number",
          value: "JSUFK2231H",
        },
        {
          code: "np_type",
          value: "MSN",
        },
      ],
    },
  ];

  return existingPayload;
}
