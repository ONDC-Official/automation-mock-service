import { SessionData } from "../../../../session-types";

export async function on_search_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const descriptorTags = existingPayload?.message.catalog?.['bpp/descriptor']?.tags;
	
	sessionData.bap_features?.forEach((feature) => {
		console.log(`Feature: ${feature}`);
	});
	if (sessionData.bap_features?.includes("0099")) {
		let bppTermsTag = descriptorTags.find((t: any) => t.code === "bpp_terms");
		const paymentCollection = {
			"code":"collect_payment",
			"value":"Y"
		}
		bppTermsTag.list.push(paymentCollection);
		const provider = existingPayload?.message.catalog["bpp/providers"][0];
		provider.offers = provider?.offers || [];
		provider.offers.push({
			id: "FIN1",
			descriptor: {
			code: "financing",
			images: ["https://sellerNP.com/images/offer2-banner.png"],
			},
			location_ids: ["L1"],
			item_ids: ["I1", "I2", "I3"],
			time: {
			label: "valid",
			range: {
				start: "2024-12-23T06:55:45.035Z",
				end: "2030-12-23T08:12:15.033Z",
			},
			},
			tags: [
			{
				code: "finance_terms",
				list: [
				{ code: "subvention_type", value: "percent" },
				{ code: "subvention_amount", value: "10.00" },
				],
			},
			{
				code: "meta",
				list: [
				{ code: "additive", value: "no" },
				{ code: "auto", value: "no" },
				],
			},
			],
		});
	}
	if (sessionData.bap_features?.includes("007")) {
		let bppTermsTag = descriptorTags.find((t: any) => t.code === "bpp_terms");
		const paymentCollection = {
			"code":"collect_payment",
			"value":"Y"
		}
		bppTermsTag.list.push(paymentCollection);
	}
	return existingPayload;
}