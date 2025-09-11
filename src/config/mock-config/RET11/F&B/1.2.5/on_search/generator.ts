import { SessionData, Input } from "../../../session-types";
import { discount, buyXgetY } from "./offers";
import { getFutureDate } from "../../../../../../utils/generic-utils";
import { stateCodes } from "../areaCodes";

export const onSearchGenerator = (
  existingPayload: any,
  sessionData: SessionData,
  inputs?: Input
) => {
  if (inputs?.offers?.length) {
    console.log("inputs", inputs, inputs.offers.includes());
    if (inputs.offers.includes("discount")) {
      existingPayload.message.catalog["bpp/providers"][0].offers = discount;
    }

    if (inputs.offers.includes("buyXgetY")) {
      existingPayload.message.catalog["bpp/providers"][0].offers = buyXgetY;
    }
  }

  const search_bap_terms = sessionData.search_bap_terms;
  const codesToFind = ["001", "008","00A"];
  const bapCodes = new Set();

  for (const item of search_bap_terms.list) {
    if (codesToFind.includes(item.code)) {
      bapCodes.add(item.code);
    }
  }

  const uniqueBapCodes = Array.from(bapCodes);

  existingPayload.message.catalog[
    "bpp/providers"
  ][0].locations[0].address.area_code = Object.keys(stateCodes).find(
    (k) => "std:" + stateCodes[k] === existingPayload.context.city
  );

  existingPayload.message.catalog[
    "bpp/providers"
  ][0].locations[0].time.schedule.holidays = [
    getFutureDate(10),
    getFutureDate(15),
  ];

  for (const code of uniqueBapCodes) {
    if (code === "001") {
      const items = existingPayload.message.catalog["bpp/providers"][0].items;
      items.forEach((item: any) => {
        const typeTag = item.tags.find(
          (tag: any) => tag.code === "type" && tag.list.some((listItem: any) => listItem.code === "type" && listItem.value === "item")
        );

        if (typeTag) {
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
        }
      });
    }
    if (code === "008") {
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
    if (code === "00A") {
      const providerTags = existingPayload.message.catalog["bpp/providers"][0].tags;
      const existingProviderNpFees = providerTags.find(
        (tag: any) => tag.code === "np_fees"
      );
      if (!existingProviderNpFees) {
        providerTags.push({
          code: "np_fees",
          list: [
            {
              code: "channel_margin_type",
              value: "percent",
            },
            {
              code: "channel_margin_value",
              value: "0.50",
            },
          ],
        });
      }
      const categories = existingPayload.message.catalog["bpp/providers"][0].categories;
      categories.forEach((category: any) => {
        const existingCategoryNpFees = category.tags.find(
          (tag: any) => tag.code === "np_fees"
        );
        if (!existingCategoryNpFees) {
          category.tags.push({
            code: "np_fees",
            list: [
              {
                code: "channel_margin_type",
                value: "percent",
              },
              {
                code: "channel_margin_value",
                value: "0.50",
              },
            ],
          });
        }
      });
      const items = existingPayload.message.catalog["bpp/providers"][0].items;
      items.forEach((item: any) => {
        const existingItemNpFees = item.tags.find(
          (tag: any) => tag.code === "np_fees"
        );
        if (!existingItemNpFees) {
          item.tags.push({
            code: "np_fees",
            list: [
              {
                code: "channel_margin_type",
                value: "percent",
              },
              {
                code: "channel_margin_value",
                value: "0.50",
              },
            ],
          });
        }
      });
    }
  }

  return existingPayload;
};
