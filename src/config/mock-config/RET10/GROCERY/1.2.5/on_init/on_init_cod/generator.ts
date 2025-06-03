import { SessionData } from "../../../../session-types";
import { on_init_generator } from "../on_init/generator";

export async function on_init_cod_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	existingPayload = await on_init_generator(existingPayload, sessionData);
	return existingPayload;
}
