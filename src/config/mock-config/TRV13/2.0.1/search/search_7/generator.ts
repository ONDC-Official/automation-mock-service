import { SessionData } from "../../../session-types";

export async function search_7_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;
  existingPayload.context.ttl = "P7D";
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + 5);
  existingPayload.message.intent.category =
    sessionData?.search_6_intent_category;
  existingPayload.message.intent.tags = sessionData.search_6_tags?.flat() ?? [];

  existingPayload.message.intent.category.time = {
    label: "AVAILABLE",
    range: {
      start: currentDate.toISOString(),
      end: futureDate.toISOString(),
    },
  };

  existingPayload.message.intent.fulfillment = {
    stops: [
      {
        location: {
          area_code: "560100",
          gps: "12.827359, 77.691570",
        },
        type: "END",
      },
    ],
  };

  return existingPayload;
}
