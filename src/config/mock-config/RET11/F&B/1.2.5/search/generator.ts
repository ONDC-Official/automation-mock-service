import { SessionData, Input } from "../../../session-types";

import { getFutureDate } from "../../../../../../utils/generic-utils";

const featureDiscoveryCode = [
	"001",
	"002",
	"003",
	"004",
	"005",
	"006",
	"007",
	"008",
	"0091",
	"0092",
	"0093",
	"0094",
	"0095",
	"0096",
	"0097",
	"0098",
	"0099",
	"00A",
	"00B",
	"00C",
	"00D",
	"00E",
	"00F",
	"010",
	"011",
	"012",
	"013",
	"014",
	"015",
	"016",
	"017",
	"018",
	"019",
	"01A",
	"01B",
	"01C",
	"01D",
	"01E",
	"01F",
	"020",
	"021",
	"022",
	"023",
	"024",
	"025",
];

export const searchGenerator = (
	existingPayload: any,
	sessionData: SessionData,
	inputs?: Input
) => {
	existingPayload.message.intent.tags.push({
		code: "bap_features",
		list: featureDiscoveryCode.map((code) => {
			return {
				code: code,
				value: "yes",
			};
		}),
	});

	if (inputs?.options) {
		if (inputs.options.includes("promo")) {
			existingPayload.message.intent.tags.push({
				code: "bap_promos",
				list: [
					{
						code: "category",
						value: "F&B",
					},
					{
						code: "from",
						value: existingPayload.context.timestamp,
					},
					{
						code: "to",
						value: getFutureDate(6, true),
					},
				],
			});
		}

		if (inputs.options.includes("demandSignal")) {
			existingPayload.message.intent.tags.push({
				code: "bnp_demand_signal",
				list: [
					{
						code: "search_term",
						value: '[{"cake"},{"pizza"},{"milk"}]',
					},
				],
			});
		}
	}
	existingPayload.message.intent.tags.list[2].value = new Date(
		new Date().getTime() + 10 * 25 * 60 * 60 * 100
	).toISOString();
	return existingPayload;
};
