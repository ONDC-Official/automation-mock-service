import { SessionData } from "../../../session-types";

export async function search_incremental_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;
  existingPayload.message.intent.category =
    sessionData?.search_1_intent_category;
  const tags = sessionData.search_1_tags[0] ?? [];

  existingPayload.message.intent.tags = [
    ...tags,
    {
      descriptor: { code: "CATALOG_INC" },
      list: [
        {
          descriptor: { code: "MODE" },
          value: "START",
        },
      ],
    },
  ];

  // // start and end date
  // const currentTimeStamp = new Date(existingPayload.context.timestamp);
  // existingPayload.message.intent.fulfillment.stops[0].time.range.start = currentTimeStamp.toISOString();
  // const endDate = new Date(currentTimeStamp);
  // endDate.setDate(endDate.getDate() + 2);
  // existingPayload.message.intent.fulfillment.stops[0].time.range.end = endDate.toISOString();

  return existingPayload;
}
