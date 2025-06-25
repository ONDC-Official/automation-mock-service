import { SessionData } from "../../../../session-types";

export async function search_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	delete existingPayload.context.bpp_uri;
	delete existingPayload.context.bpp_id;
	let codesArray = sessionData?.user_inputs?.feature_discovery || [];
	const tags = existingPayload.message.intent.tags as any[];
	tags[0].list[2].value = new Date(
		new Date().getTime() + 1000 * 60 * 60 * 24 * 10
	).toISOString();
	tags.push({
		code: "bap_features",
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
