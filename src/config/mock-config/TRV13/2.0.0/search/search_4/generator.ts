import { SessionData } from "../../../session-types";

export async function search_specific_hotel_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;
  const userInput =
    typeof sessionData?.user_inputs?.data === "string"
      ? JSON.parse(sessionData?.user_inputs?.data)
      : sessionData?.user_inputs?.data;
  existingPayload.message.intent.provider = {
    id: userInput?.providerId ?? "ondc-hotel-provider1",
    descriptor: {
      name: userInput?.providerName ?? "hotel-abc",
    },
    time: {
      label: "AVAILABLE",
      range: {
        start: userInput?.checkInDate ?? "2026-01-15T00:00:00Z",
        end: userInput?.checkOutDate ?? "2026-01-16T00:00:00Z",
      },
    },
  };
  // const currentDate = new Date();
  // const futureDate = new Date(currentDate);
  // futureDate.setDate(currentDate.getDate() + 5);
  // existingPayload.message.intent.category =
  //   sessionData?.search_1_intent_category;
  // const tags = sessionData.search_1_tags[0] ?? [];

  // const tagsArray =
  //   tags?.filter((tag: any) => tag.descriptor.code !== "CATALOG_INC") ?? [];
  // existingPayload.message.intent.tags = [...tagsArray];
  // existingPayload.message.intent.provider.time = {
  //   label: "AVAILABLE",
  //   range: {
  //     start: currentDate.toISOString(),
  //     end: futureDate.toISOString(),
  //   },
  // };

  // // start and end date
  // const currentTimeStamp = new Date(existingPayload.context.timestamp);
  // existingPayload.message.intent.fulfillment.stops[0].time.range.start = currentTimeStamp.toISOString();
  // const endDate = new Date(currentTimeStamp);
  // endDate.setDate(endDate.getDate() + 2);
  // existingPayload.message.intent.fulfillment.stops[0].time.range.end = endDate.toISOString();

  return existingPayload;
}
