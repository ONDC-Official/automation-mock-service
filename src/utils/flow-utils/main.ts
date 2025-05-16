import axios from "axios";
import { BecknContext } from "../../types/BeknTypes";
import { Flow } from "../../types/flow-types";
import logger from "../logger";
import { SessionCache } from "../../types/api-session-cache";

export function computeSubscriber(context: BecknContext) {
	const action = context.action;
	if (action.startsWith("on")) {
		if (!context.bpp_uri) {
			logger.error("BPP URI is not present in the context");
			throw new Error("BPP URI is not present in the context");
		}
		logger.info(
			"computed subscriber for action " + action + " is " + context.bpp_uri
		);
		return context.bpp_uri;
	}
	logger.info(
		"computed subscriber for action " + action + " is " + context.bap_uri
	);
	return context.bap_uri;
}

export function fetchFlow(sessionData: SessionCache, flowId: string): Flow {
	try {
		const flow = sessionData.flowConfigs[flowId];
		if (!flow) {
			logger.error(
				`Flow not found for flowId: ${flowId} in sessionData: ${JSON.stringify(
					sessionData
				)}`
			);
			throw new Error(`Flow not found for flowId: ${flowId}`);
		}
		return flow;
	} catch (error) {
		logger.error(
			`Error fetching flow for flowId: ${flowId} in sessionData: ${JSON.stringify(
				sessionData
			)}`
		);
		throw error;
	}
}
