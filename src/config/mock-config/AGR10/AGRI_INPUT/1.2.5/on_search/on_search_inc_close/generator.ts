import { SessionData } from "../../../../session-types";

export async function on_search_inc_close(
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
						label: "close",
						timestamp: new Date().toISOString(),
						range: {
							start: new Date().toISOString(),
						},
					},
				},
			],
		},
	];
	return existingPayload;
}
