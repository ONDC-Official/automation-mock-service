import { SessionData } from "../../../../session-types";
import { updateFlowConfigWithDynOnStatuses } from "../../on_init/on_init_multi_fulfillment/generator";
import { confirm_generator } from "../confirm/generator";

export async function confirm_multi_fulfillment_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const payload = await confirm_generator(existingPayload, sessionData);
	await updateFlowConfigWithDynOnStatuses(
		payload.message.order.fulfillments,
		sessionData
	);
	return payload;
}
