import { SessionData } from "../../../../session-types";

export async function search_cat_rej_generator(
  existingPayload: any,
  sessionData: SessionData
) {

  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;

  return existingPayload;
}
