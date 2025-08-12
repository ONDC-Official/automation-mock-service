import { SessionData } from "../../../../session-types";
import { getRandomItem } from "../../on_select/on_select_out_of_stock/generator";
import { stateCodeToPin } from "../../select/state-codes-reverse";
import { RET10GROCERY125Catalog } from "../catalog";
import jsonpath from "jsonpath";
export async function on_search_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  const search_bap_terms = sessionData.search_bap_terms;
  const codesToFind = ["001", "008"];
  const bapCodes = new Set();

  for (const item of search_bap_terms.list) {
    if (codesToFind.includes(item.code)) {
      bapCodes.add(item.code);
    }
  }

  const uniqueBapCodes = Array.from(bapCodes);

  existingPayload.message = RET10GROCERY125Catalog;
  const cityCode = existingPayload.context.city; // std:001
  const cityCodeNum = cityCode.split(":")[1];
  const areas = stateCodeToPin[cityCodeNum as keyof typeof stateCodeToPin] ?? [
    "144203",
  ];
  jsonpath.apply(existingPayload, "$..area_code", (_: any) => {
    return getRandomItem(areas);
  });

  for (const code of uniqueBapCodes) {
    if (code === "001") {
      const items = existingPayload.message.catalog["bpp/providers"][0].items;
      items.forEach((item: any) => {
        const existingTimingTag = item.tags.find(
          (tag: any) => tag.code === "timing"
        );
        if (!existingTimingTag) {
          item.tags.push({
            code: "timing",
            list: [
              {
                code: "day_from",
                value: "1",
              },
              {
                code: "day_to",
                value: "7",
              },
              {
                code: "time_from",
                value: "0000",
              },
              {
                code: "time_to",
                value: "2359",
              },
            ],
          });
        }
      });
    }
    if (code === "008") {
      {
        existingPayload.message.catalog["bpp/providers"][0].tags.push({
          code: "order_value",
          list: [
            {
              code: "min_value",
              value: "300.00",
            },
          ],
        });
      }
    }
  }

  return existingPayload;
}
