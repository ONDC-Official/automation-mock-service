import {
  getFutureDate,
  TatMapping,
  getFutureDateInMinutes,
} from "../../../../../../../utils/generic-utils";
import { SessionData, Input } from "../../../../session-types";
function getISOWithOffset(hours = 0, days = 0) {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}
export async function search_B2B_Logistics(existingPayload: any, sessionData: SessionData, inputs: Input | undefined, action_id: string) {

  existingPayload.message.intent.provider.time.schedule.holidays = [
    getFutureDate(10),
    getFutureDate(15),
  ];
  console.log("inputs in search B2B generator", inputs);
  existingPayload.message.intent.fulfillment.start.time = {
    range: {
      start: getISOWithOffset(),
      end: getISOWithOffset(3)
    }
  };

  existingPayload.message.intent.fulfillment.end.time = {
    range: {
      start: getISOWithOffset(0, 1),
      end: getISOWithOffset(3, 1)
    }
  };

  const categoryFromInput = inputs?.retailCategory; // e.g. "Grocery"

  if (categoryFromInput) {
    const linkedOrderTag = existingPayload.message.intent.fulfillment.tags
      .find((tag: any) => tag.code === "linked_order");

    if (linkedOrderTag) {
      const categoryEntry = linkedOrderTag.list
        .find((item: any) => item.code === "category");

      if (categoryEntry) {
        // Update existing category
        categoryEntry.value = categoryFromInput;
      } else {
        // Add category if missing
        linkedOrderTag.list.push({
          code: "category",
          value: categoryFromInput
        });
      }
    }
  }

  const fulfillmentTags = existingPayload.message.intent.fulfillment.tags;

  // Find special_req tag
  let specialReqTag = fulfillmentTags.find(
    (tag: any) => tag.code === "special_req"
  );

  if (!specialReqTag) {
    specialReqTag = { code: "special_req", list: [] };
    fulfillmentTags.push(specialReqTag);
  }

  // Always include cold_storage flag if present
  if (inputs?.cold_storage) {
    specialReqTag.list.push({
      code: "cold_storage",
      value: inputs.cold_storage
    });
  }

  // ✅ Include temperature tags ONLY when cold_storage = "yes"
  if (inputs?.cold_storage === "yes") {
    specialReqTag.list.push(
      {
        code: "cold_storage_temp_min",
        value: "0"
      },
      {
        code: "cold_storage_temp_max",
        value: "4"
      },
      {
        code: "cold_storage_temp_unit",
        value: "celsius"
      }
    );
  }
  if (inputs?.insurance_required === "yes") {
    specialReqTag.list.push({
      code: "insurance_owner",
      value: inputs.insurance_owner
    })
  }

  return existingPayload;
}