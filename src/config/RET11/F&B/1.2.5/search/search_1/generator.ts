import { SessionData, Input } from "../../../../session-types";

export const search1Generator = (
  existingPayload: any,
  sessionData: SessionData,
  inputs?: Input
) => {
  if (inputs?.search_mode) {
    existingPayload.message.intent.tags[0].list[0].value = inputs.search_mode;
  }

  return existingPayload;
};
