import { randomUUID } from "crypto";
import { SessionData } from "../../../../session-types";

export async function on_search_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  const providers = existingPayload?.message.catalog?.['bpp/providers'];
  //   "012"
  // "Cash on delivery (COD) order"
  // "017"
  // "Seller Creds"
  // "01A"
  // "Item Unitized Count"
  // "01B"
  // "Minimum Item Quantity"
  // "01B"
  // "Minimum order value"

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
                "value": "2023-06-03T00:00:00.000Z"
              },
              {
                "code": "valid_to",
                "value": "2024-06-03T23:59:59.999Z"
              }
            ]
          }
        ]
      }
    ]
    providers.forEach((provider: any) => {
      provider.creds = creds;
    });
  };
  if (sessionData.bap_features?.includes("01A")) {
    providers.forEach((provider: any) => {
      const items = provider.items;
      items.forEach((item: any) => {
        item.quantity.unitized.count = "3";
      });
    });
  };
  if (sessionData.bap_features?.includes("01A")) {
    providers.forEach((provider: any) => {
      const items = provider.items;
      items.forEach((item: any) => {
        item.quantity.minimum = {count : "1"};
      });
    });
  };
  if (sessionData.bap_features?.includes("01B")) {
    providers.forEach((provider: any) => {
      const tags = provider.tags || [];
      tags.push({
        "code": "order_value",
        "list": [
          {
            "code": "min_value",
            "value": "600.00"
          }
        ]
      });
    });
  };
  return existingPayload;
}
