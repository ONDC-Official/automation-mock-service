export async function onSearchIncrementalPull1Generator(existingPayload: any, sessionData: any) {

  existingPayload?.message?.catalog?.providers?.map((provider: any) => {
    provider.descriptor.code = sessionData?.search_1_descriptor_code ?? "HOTEL";
  })
  return existingPayload;
} 