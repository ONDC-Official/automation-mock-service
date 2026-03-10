import { cloneDeep } from "lodash";

export async function onSearch_5_generator(
  existingPayload: any,
  sessionData: any
) {
  existingPayload.message.catalog.providers[0].id =
    sessionData?.search_5_provider_id ?? "P1";
    existingPayload.message.catalog.providers[0].descriptor.code =
    sessionData?.search_5_descriptor_code ?? "HOTEL";
  existingPayload.message.catalog.providers[0].time.timestamp =
    sessionData?.context?.timestamp ?? new Date().toISOString();
  // Use lodash cloneDeep (better than JSON.parse(JSON.stringify))
  // existingPayload.message.catalog = sessionData?.on_search_1_catalog
  //   ? cloneDeep(sessionData.on_search_1_catalog)
  //   : {};

  return existingPayload;
}
