import { SessionData } from "../../../../session-types";
import { Fulfillments } from "../../api-objects/fulfillments";
import { on_init_generator } from "../on_init/generator";
import { SessionCacheService } from "../../../../../../../services/cache-services";
import { logger } from "../../../../../../../utils/logger";

export async function on_init_multi_fulfillment_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	const payload = await on_init_generator(existingPayload, sessionData);
	await updateFlowConfigWithDynOnStatuses(
		payload.message.order.fulfillments,
		sessionData
	);
	return payload;
}

export async function updateFlowConfigWithDynOnStatuses(
	fulfillments: Fulfillments,
	sessionData: SessionData
) {
	const newFlowConfig: any = [];
	fulfillments.forEach((fulfillment, index) => {
		let duplicateFlowConfig = JSON.parse(JSON.stringify(flowConfig));
		duplicateFlowConfig = duplicateFlowConfig.map((f: any) => {
			return {
				...f,
				key: `dyn_${f.key}_${index}`,
				description: `${f.description} - for fulfillment: ${fulfillment.id}`,
				label: `${f.label} - for fulfillment: ${fulfillment.id}`,
			};
		});
		newFlowConfig.push(...duplicateFlowConfig);
	});
	if (sessionData.protocol_session_id) {
		try {
			const sessionService = new SessionCacheService();
			const protocolSession = await sessionService.loadSessionThatExists(
				sessionData.protocol_session_id
			);

			const config =
				protocolSession.flowConfigs["Multi_Option_Fulfillment_Flow"];
			config.sequence = config.sequence.filter(
				(f) => !f.key.includes("dyn_on_status")
			);
			if (config.sequence.length <= 7) {
				config.sequence.push(...newFlowConfig);
			} else {
				config.sequence = config.sequence.slice(0, 7);
				config.sequence.push(...newFlowConfig);
			}
			await sessionService.savedToCache(
				sessionData.protocol_session_id,
				protocolSession
			);
		} catch (error) {
			logger.error(
				`Error while saving flow config for session ${sessionData.protocol_session_id}`,
				error
			);
		}
	}
}

const flowConfig = [
	{
		key: "on_status_packed",
		type: "on_status",
		unsolicited: true,
		pair: null,
		owner: "BPP",
		expect: false,
		description: "Status updates - order packed",
		label: "Order Packed",
	},
	{
		key: "on_status_agent_assigned",
		type: "on_status",
		unsolicited: true,
		pair: null,
		owner: "BPP",
		expect: false,
		description: "Status updates - agent assigned",
		label: "Agent Assigned",
	},
	{
		key: "on_status_picked",
		type: "on_status",
		unsolicited: true,
		pair: null,
		owner: "BPP",
		expect: false,
		description: "Status updates - order picked up",
		label: "Order Picked Up",
	},
	{
		key: "on_status_out_for_delivery",
		type: "on_status",
		unsolicited: true,
		pair: null,
		owner: "BPP",
		expect: false,
		description: "Status updates - order out for delivery",
		label: "Out for Delivery",
	},
	{
		key: "on_status_order_delivered",
		type: "on_status",
		unsolicited: true,
		pair: null,
		owner: "BPP",
		expect: false,
		description: "Status updates - order delivered",
		label: "Order Delivered",
	},
];
