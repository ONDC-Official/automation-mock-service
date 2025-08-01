import { BecknContext } from "../../types/BeknTypes";
import { Flow } from "../../types/flow-types";
import { SessionCache } from "../../types/api-session-cache";

export function computeSubscriber(context: BecknContext) {
	const action = context.action;
	if (action.startsWith("on")) {
		if (!context.bpp_uri) {
			throw new Error("BPP URI is not present in the context");
		}
		return context.bpp_uri;
	}
	return context.bap_uri;
}

export function fetchFlow(sessionData: SessionCache, flowId: string): Flow {
	try {
		const flow = sessionData.flowConfigs[flowId];
		if (!flow) {
			throw new Error(`Flow not found for flowId: ${flowId}`);
		}
		return flow;
	} catch (error) {
		throw error;
	}
}
