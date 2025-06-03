import { SessionData, Input } from "../../../session-types";
import { discount, buyXgetY } from "./offers";
import { getFutureDate } from "../../../../../../utils/generic-utils";

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

  existingPayload.message.catalog[
    "bpp/providers"
  ][0].locations[0].time.schedule.holidays = [
    getFutureDate(10),
    getFutureDate(15),
  ];

  return existingPayload;
};
