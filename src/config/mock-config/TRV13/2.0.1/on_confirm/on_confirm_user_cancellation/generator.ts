export async function onConfirmUserCancellationGenerator(existingPayload: any, sessionData: any) {
  if (existingPayload.context) {
    existingPayload.context.bap_id = sessionData?.bap_id;
    existingPayload.context.bap_uri = sessionData?.bap_uri;
    existingPayload.context.bpp_id = sessionData?.bpp_id;
    existingPayload.context.bpp_uri = sessionData?.bpp_uri;
    if (existingPayload.context.location?.city) {
      existingPayload.context.location.city.code = sessionData?.city_code;
    }
  }
  return existingPayload;} 