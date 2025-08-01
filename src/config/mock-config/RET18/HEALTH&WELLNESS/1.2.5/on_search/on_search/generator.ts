import { randomUUID } from "crypto";
import { SessionData } from "../../../../session-types";

export async function on_search_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const providers = existingPayload?.message.catalog?.['bpp/providers'];
  console.log("session data features",sessionData)
  
	// sessionData.bap_features?.forEach((feature) => {
	// 	console.log(`Feature: ${feature}`);
	// });
	if (sessionData.bap_features?.includes("00B")) {
		const replacement_terms =  [{
			"replace_within":
			{
				"duration":"P9D"
			}
		}]
		providers.forEach((provider: any) => {
			const items = provider?.items;
			items.forEach((item: any) => {
				item.replacement_terms = replacement_terms;
			});
		});
	}

	if (sessionData.bap_features?.includes("017")) {
    const existingTimestamp = new Date(existingPayload.context.timestamp);
    const newTimestamp = new Date(existingTimestamp.getTime() + 24 * 60 * 60 * 1000); 
    const toTimestamp = newTimestamp.toISOString();
		const creds = [
        {
          "id": randomUUID().toString(),
          "descriptor": {
            "code": "Social Sector",
            "short_desc": "GI"
          },
          "url": "https://mock.cdn.com/images/badge-img",
          "tags": [
            {
              "code": "verification",
              "list": [
                {
                  "code": "verify_url",
                  "value": "https://mock.gi.com/verify?id=gi-12345678'"
                },
                {
                  "code": "verifier",
                  "value": "CSP-ABC"
                },
                {
                  "code": "issuer",
                  "value": "Example Authority"
                },
                {
                  "code": "valid_from",
                  "value": existingPayload.context.timestamp
                },
                {
                  "code": "valid_to",
                  "value": toTimestamp
                }
              ]
            }
          ]
        }
      ]
	  	providers.forEach((provider: any) => {
			provider.creds = creds;
		});
    }

	return existingPayload;
}
