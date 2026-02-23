export async function onSearchIncrementalPull1Generator(existingPayload: any, sessionData: any) {
  const currentTimestamp = new Date().toISOString();

  existingPayload?.message?.catalog?.providers?.map((provider: any) => {
    provider.descriptor.code = sessionData?.search_1_descriptor_code ?? "HOTEL";
    if (provider.time) {
      provider.time.timestamp = currentTimestamp;
    }
  });
  return existingPayload;
} 