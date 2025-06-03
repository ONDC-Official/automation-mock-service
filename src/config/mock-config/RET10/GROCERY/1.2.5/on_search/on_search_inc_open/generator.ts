import { SessionData } from "../../../../session-types";

export async function on_search_inc_open(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload.message.catalog["bpp/providers"] = [
		{
			id: "P1",
			locations: [
				{
					id: "L1",
					time: {
						label: "open",
						timestamp: new Date().toISOString(),
					},
				},
			],
		},
	];
	return existingPayload;
}
