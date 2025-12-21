import { SessionData } from "../../../../session-types";
import { init_generator } from "../init/generator";

export async function init_cod_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const defaultInit = init_generator(existingPayload, sessionData);
	return defaultInit;
}
