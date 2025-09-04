import { SessionData } from "../../../session-types";

export async function search_5_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;

  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + 5);

  // existingPayload.message.intent.category =
  //   sessionData?.search_1_intent_category;
  // const tags = sessionData.search_1_tags[0] ?? [];
  // existingPayload.message.intent.tags = tags;
  existingPayload.message.intent.provider.time = {
    label: "AVAILABLE",
    range: {
      start: currentDate.toISOString(),
      end: futureDate.toISOString(),
    },
  };

  // // start and end date
  // const currentTimeStamp = new Date(existingPayload.context.timestamp);
  // existingPayload.message.intent.fulfillment.stops[0].time.range.start = currentTimeStamp.toISOString();
  // const endDate = new Date(currentTimeStamp);
  // endDate.setDate(endDate.getDate() + 2);
  // existingPayload.message.intent.fulfillment.stops[0].time.range.end = endDate.toISOString();

  return existingPayload;
}
