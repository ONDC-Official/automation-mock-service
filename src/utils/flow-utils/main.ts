import { BecknContext } from "../../types/BeknTypes";
import { Flow } from "../../types/flow-types";
import { logError, logger, logInfo } from "../logger";
import { SessionCache } from "../../types/api-session-cache";

export function computeSubscriber(context: BecknContext) {
	logInfo({
		message: "Entering computeSubscriber Function.",
		meta: { action: context.action },
		transaction_id: context.transaction_id,
	});
	const action = context.action;
	if (action.startsWith("on")) {
		if (!context.bpp_uri) {
			// logger.error("BPP URI is not present in the context");
			logInfo({
				message:
					"Exiting computeSubscriber Function. BPP URI is not present in the context",
				meta: { action },
				transaction_id: context.transaction_id,
			});
			throw new Error("BPP URI is not present in the context");
		}
		// logger.info(
		// 	"computed subscriber for action " + action + " is " + context.bpp_uri
		// );
		logInfo({
			message:
				"Exiting computeSubscriber Function. Computed subscriber for action " +
				action +
				" is " +
				context.bpp_uri,
			meta: { action, bpp_uri: context.bpp_uri },
			transaction_id: context.transaction_id,
		});
		return context.bpp_uri;
	}
	// logger.info(
	// 	"computed subscriber for action " + action + " is " + context.bap_uri
	// );
	logInfo({
		message:
			"Exiting computeSubscriber Function. Computed subscriber for action " +
			action +
			" is " +
			context.bap_uri,
		meta: { action, bap_uri: context.bap_uri },
		transaction_id: context.transaction_id,
	});
	return context.bap_uri;
}

export function fetchFlow(sessionData: SessionCache, flowId: string): Flow {
	logInfo({
		message: "Entering fetchFlow Function.",
		meta: { flowId },
	});
	try {
		const flow = sessionData.flowConfigs[flowId];
		if (!flow) {
			// logger.error(
			// 	`Flow not found for flowId: ${flowId} in sessionData: ${JSON.stringify(
			// 		sessionData
			// 	)}`
			// );
			logInfo({
				message: `Exiting fetchFlow Function. Flow not found for flowId: ${flowId} in sessionData`,
				meta: { flowId, sessionData },
			});
			throw new Error(`Flow not found for flowId: ${flowId}`);
		}
		logInfo({
			message: "Exiting fetchFlow Function. Flow found",
			meta: { flowId, flow },
		});
		return flow;
	} catch (error) {
		// logger.error(
		// 	`Error fetching flow for flowId: ${flowId} in sessionData: ${JSON.stringify(
		// 		sessionData
		// 	)}`
		// );
		logError({
			message: `Error in fetchFlow Function. Error fetching flow for flowId: ${flowId} in sessionData`,
			meta: { flowId, sessionData },
			error,
		});
		throw error;
	}
}
