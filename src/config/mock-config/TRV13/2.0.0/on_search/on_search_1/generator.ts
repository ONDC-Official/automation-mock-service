export async function onSearchIncrementalPull1Generator(existingPayload: any, sessionData: any) {
  const currentTimestamp = new Date().toISOString();
  const endTimestamp = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

  existingPayload?.message?.catalog?.providers?.map((provider: any) => {
    provider.descriptor.code = sessionData?.search_1_descriptor_code ?? "HOTEL";
    if (provider.time) {
      provider.time.timestamp = currentTimestamp;
    }
    provider.items?.forEach((item: any) => {
      if (item.time) {
        item.time.timestamp = currentTimestamp;
        if (item.time.range) {
          item.time.range.start = currentTimestamp;
          item.time.range.end = endTimestamp;
        }
      }
    });
  });
  return existingPayload;
} 