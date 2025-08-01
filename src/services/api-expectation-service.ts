import { RedisService } from "ondc-automation-cache-lib";
import { SubscriberCache } from "../types/api-session-cache";
import { logger, logInfo, logError, logDebug } from "../utils/logger";
const EXPECTATION_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const createExpectationService = async (
	subscriberUrl: string,
	flowId: string,
	sessionId: string,
	expectedAction: string
): Promise<string> => {
	logInfo({
		message: "Entering createExpectationService Function.",
		meta: {
			subscriberUrl,
			flowId,
			sessionId,
			expectedAction,
		},
	});	
	try {
		// Fetch existing session data from Redis
		const sessionData = await RedisService.getKey(subscriberUrl);

		let parsed: SubscriberCache = { activeSessions: [] };

		if (sessionData) {
			const paraseSession = JSON.parse(sessionData);
			if (paraseSession.activeSessions) {
				parsed = JSON.parse(sessionData);
			}
		}

		// Remove expired expectations and check for conflicts
		parsed.activeSessions = parsed.activeSessions.filter((expectation) => {
			const isExpired = new Date(expectation.expireAt) < new Date();

			if (isExpired) return false; // Remove expired session

			if (expectation.sessionId === sessionId) {
				logInfo({
					message: "Expectation already exists for this session and flow.",
					meta: {
						sessionId,
						flowId,
						expectedAction,
					},
				});
				throw new Error(
					`Expectation already exists for sessionId: ${sessionId} and flowId: ${flowId}`
				);
			}

			if (expectation.expectedAction === expectedAction) {
				logInfo({
					message: "Expectation already exists for this action.",
					meta: {
						sessionId,
						flowId,
						expectedAction,
					},
				});
				throw new Error(
					`Expectation already exists for the action: ${expectedAction}`
				);
			}
			
			return true; // Keep valid expectations
		});

		// Add new expectation
		const expireAt = new Date(Date.now() + EXPECTATION_EXPIRY).toISOString();

		const expectation = {
			sessionId,
			flowId,
			expectedAction,
			expireAt,
		};

		parsed.activeSessions.push(expectation);
		// Update Redis with the modified session data
		await RedisService.setKey(subscriberUrl, JSON.stringify(parsed));
		await RedisService.setKey(subscriberUrl, JSON.stringify(parsed));
		logInfo({
			message: "Exiting createExpectationService Function. Expectation created successfully.",
			meta: {
				sessionId,
				flowId,
				expectedAction,
			},
		});
		return "Expectation created successfully";
	} catch (error: any) {
		logError({
			message: "Error in createExpectationService Function.",
			meta: {
				subscriberUrl,
				flowId,
				sessionId,
				expectedAction,
			},
			error,
		});
		throw new Error(`Failed to create expectation: ${error.message}`);
	}
};

export const deleteExpectationService = async (
	sessionId: string,
	subscriberUrl: string
) => {
	try {
		logInfo({
			message: "Entering deleteExpectationService Function.",
			meta: {
				sessionId,
				subscriberUrl,
			},
		});
		const subscriberData = await RedisService.getKey(subscriberUrl);
		if (!subscriberData) {
			logInfo({
				message: "Exiting deleteExpectationService Function. Session not found.",
				meta: {
					sessionId,
					subscriberUrl,
				},
			});
			throw new Error("Session not found");
		}

		const parsed: SubscriberCache = JSON.parse(subscriberData);
		// logger.debug("Parsed data" + JSON.stringify(parsed));
		logDebug({
			message: "Parsed data",
			meta: {
				parsed,
			},
		});
		if (parsed.activeSessions === undefined) {
			logInfo({
				message: "Exiting deleteExpectationService Function. No active sessions found.",
				meta: {
					sessionId,
					subscriberUrl,
				},
			});
			throw new Error("No active sessions found");
		}
		parsed.activeSessions = parsed.activeSessions.filter(
			(expectation) => expectation.sessionId !== sessionId
		);

		await RedisService.setKey(subscriberUrl, JSON.stringify(parsed));
		logInfo({
			message: "Exiting deleteExpectationService Function. Expectation deleted successfully.",
			meta: {
				sessionId,
				subscriberUrl,
			},
		});
	} catch (e) {
		// logger.error(e);
		logError({
			message: "Error in deleteExpectationService Function.",
			meta: {
				sessionId,
				subscriberUrl,
			},
			error: e,
		});
		throw new Error("Error deleting expectation");
	}
};
