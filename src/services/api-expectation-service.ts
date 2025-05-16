import { RedisService } from "ondc-automation-cache-lib";
import { SubscriberCache } from "../types/api-session-cache";
import logger from "../utils/logger";
const EXPECTATION_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const createExpectationService = async (
	subscriberUrl: string,
	flowId: string,
	sessionId: string,
	expectedAction: string
): Promise<string> => {
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
				throw new Error(
					`Expectation already exists for sessionId: ${sessionId} and flowId: ${flowId}`
				);
			}

			if (expectation.expectedAction === expectedAction) {
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

		return "Expectation created successfully";
	} catch (error: any) {
		throw new Error(`Failed to create expectation: ${error.message}`);
	}
};

export const deleteExpectationService = async (
	sessionId: string,
	subscriberUrl: string
) => {
	try {
		const subscriberData = await RedisService.getKey(subscriberUrl);
		if (!subscriberData) {
			throw new Error("Session not found");
		}

		const parsed: SubscriberCache = JSON.parse(subscriberData);
		logger.debug("Parsed data" + JSON.stringify(parsed));
		if (parsed.activeSessions === undefined) {
			throw new Error("No active sessions found");
		}
		parsed.activeSessions = parsed.activeSessions.filter(
			(expectation) => expectation.sessionId !== sessionId
		);

		await RedisService.setKey(subscriberUrl, JSON.stringify(parsed));
	} catch (e) {
		logger.error(e);
		throw new Error("Error deleting expectation");
	}
};
