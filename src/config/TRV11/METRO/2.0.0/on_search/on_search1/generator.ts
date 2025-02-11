import { createFullfillment } from "../fullfillment-generator";

function updateProviderTime(payload: any) {
	const now = new Date();
	const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  
	payload.message.catalog.providers.forEach((provider: any) => {
	  if (provider.time && provider.time.range) {
		provider.time.range.start = now.toISOString();
		provider.time.range.end = twoDaysLater.toISOString();
	  }
	});
  
	return payload;
  }
export async function onSearch1Generator(
	existingPayload: any,
	sessionData: any
) {
	existingPayload.message.catalog.providers[0].fulfillments =
		createFullfillment(sessionData.city_code).fulfillments;
	existingPayload = updateProviderTime(existingPayload)
	return existingPayload;
}
