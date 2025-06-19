import { SessionData } from "../../../../session-types";
import jsonpath from "jsonpath";
export async function on_search_inc_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload.context.city = "*";
	jsonpath.apply(
		existingPayload,
		`$..catalog["bpp/providers"][0].items[0].time.timestamp`,
		(x: any) => new Date().toISOString()
	);
	return existingPayload;
}
