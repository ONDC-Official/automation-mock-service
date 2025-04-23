import { SessionData } from "../../../../session-types";

export const onSearch1Generator = (
  existingPayload: any,
  sessionData: SessionData
) => {
  existingPayload.message.catalog["bpp/providers"][0].time.timestamp =
    existingPayload.context.timestamp;

  return existingPayload;
};
