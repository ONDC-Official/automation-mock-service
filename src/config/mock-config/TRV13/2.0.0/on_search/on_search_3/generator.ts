
export async function onSearchSellerPagination1Generator(
  existingPayload: any,
  sessionData: any
) {

  // Use lodash cloneDeep (better than JSON.parse(JSON.stringify))
  // existingPayload.message.catalog = sessionData?.on_search_1_catalog
  //   ? cloneDeep(sessionData.on_search_1_catalog)
  //   : {};

  const currentTimestamp = new Date().toISOString();

  existingPayload?.message?.catalog?.providers?.forEach((provider: any) => {
    if (provider.time) {
      provider.time.timestamp = currentTimestamp;
    }
  });

  return existingPayload;
}
