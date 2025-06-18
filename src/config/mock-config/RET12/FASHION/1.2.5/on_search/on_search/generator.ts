import { randomUUID } from "crypto";
import { SessionData } from "../../../../session-types";

export async function on_search_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const providers = existingPayload?.message.catalog?.['bpp/providers'];
  
	sessionData.bap_features?.forEach((feature) => {
		console.log(`Feature: ${feature}`);
	});
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
                  "value": "2023-06-03T00:00:00:000Z"
                },
                {
                  "code": "valid_to",
                  "value": "2024-06-03T23:59:59:999Z"
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
