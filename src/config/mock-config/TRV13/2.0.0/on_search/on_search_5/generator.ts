import { cloneDeep } from "lodash";

export async function onSearchTTLBased_generator(
  existingPayload: any,
  sessionData: any
) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;

  // Use lodash cloneDeep (better than JSON.parse(JSON.stringify))
  existingPayload.message.catalog = sessionData?.on_search_1_catalog
    ? cloneDeep(sessionData.on_search_1_catalog)
    : {};

  return existingPayload;
}
