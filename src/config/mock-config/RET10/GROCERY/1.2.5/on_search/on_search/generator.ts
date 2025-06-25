import { SessionData } from "../../../../session-types";
import { getRandomItem } from "../../on_select/on_select_out_of_stock/generator";
import { stateCodeToPin } from "../../select/state-codes-reverse";
import { RET10GROCERY125Catalog } from "../catalog";
import jsonpath from "jsonpath";
export async function on_search_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload.message = RET10GROCERY125Catalog;
	const cityCode = existingPayload.context.city; // std:001
	const cityCodeNum = cityCode.split(":")[1];
	const areas = stateCodeToPin[cityCodeNum as keyof typeof stateCodeToPin] ?? [
		"144203",
	];
	jsonpath.apply(existingPayload, "$..area_code", (_: any) => {
		return getRandomItem(areas);
	});

	return existingPayload;
}
