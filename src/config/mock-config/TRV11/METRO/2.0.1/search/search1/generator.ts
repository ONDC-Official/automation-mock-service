export async function search1Generator(existingPayload: any, sessionData: any) {
  delete existingPayload.context.bpp_id;
  delete existingPayload.context.bpp_uri;
  console.log(existingPayload, "xxxxxxxxxx");
  return existingPayload;
}
