import { SessionData } from "../../../../session-types";

export async function search_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	delete existingPayload.context.bpp_uri;
	delete existingPayload.context.bpp_id;
	let codesArray = sessionData?.user_inputs?.feature_discovery || [];
	const tags = existingPayload.message.intent.tags as any[];
	tags.push({
		code: "bnp_features",
		list: [
			{
				code: "001",
				value: "yes",
			},
			...codesArray.map((code: string) => {
				return {
					code: code,
					value: "yes",
				};
			}),
		],
	});
	return existingPayload;
}
