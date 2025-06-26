import { SessionData } from "../../../../session-types";
import { stateCodes } from "../state-codes";

type SelectInputType = {
	provider?: string;
	provider_location?: string[];
	location_gps?: string;
	location_pin_code?: string;
	items?: {
		itemId?: string;
		quantity?: number;
		location?: string;
	}[];
	[key: string]: any; // Allow additional properties
};

export async function select_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	console.log("***** Select Generator *****");
	const inputs = sessionData.user_inputs as SelectInputType;
	if (!inputs) return existingPayload;
	console.log("inputs", inputs);
	if (inputs.provider) {
		existingPayload.message.order.provider.id = inputs.provider;
	}
	if (inputs.provider_location) {
		existingPayload.message.order.provider.locations =
			inputs.provider_location.map((location) => {
				return {
					id: location,
				};
			});
	}
	if (inputs.location_gps) {
		existingPayload.message.order.fulfillments[0].end.location.gps =
			inputs.location_gps;
	}
	if (inputs.location_pin_code) {
		existingPayload.message.order.fulfillments[0].end.location.address.area_code =
			inputs.location_pin_code;
		existingPayload.context.city = `std:${
			stateCodes[inputs.location_pin_code as keyof typeof stateCodes] ?? "011"
		}`;
	}
	if (inputs.items) {
		existingPayload.message.order.items = inputs.items.map((item) => {
			return {
				id: item.itemId,
				quantity: {
					count: item.quantity,
				},
				location: item.location,
			};
		});
	}
	const inputKeys = Object.keys(inputs);
	console.log("inputKeys", inputKeys);
	const offers = inputKeys.filter((k) => k.startsWith("offers_"));
	if (offers.length > 0) {
		existingPayload.message.order.offers = offers
			.filter((offer) => inputs[offer] !== false && inputs[offer] !== null)
			.map((offer) => {
				return {
					id: offer.replace("offers_", ""),
					// tags: [
					// 	{
					// 		code: "selection",
					// 		list: [
					// 			{
					// 				code: "apply",
					// 				value: "yes",
					// 			},
					// 		],
					// 	},
					// ],
				};
			});
	}
	return existingPayload;
}

/*
sample input:
{
  provider: 'P1',
  provider_location: [ 'L2', 'L1' ],
  location_gps: '12.12333,12.99921',
  location_pin_code: '110092',
  items: [ { itemId: 'I1', quantity: 2, location: 'L2' } ]
  "offers_FLAT50": "FLAT50",
  "offers_buy2get3": false

}
*/

/*
"offers": [
        {
          "id": "FLAT50",
          "tags": [
            {
              "code": "selection",
              "list": [
                {
                  "code": "apply",
                  "value": "yes"
                }
              ]
            }
          ]
        }
],
*/
