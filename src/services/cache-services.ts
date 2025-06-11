import { RedisService } from "ondc-automation-cache-lib";
import { logger, logInfo } from "../utils/logger";
import { TransactionCache } from "../types/transaction-cache";
import { SessionCache } from "../types/api-session-cache";

export class TransactionCacheService {
	tryLoadTransaction = async (transactionId: string, subscriberUrl: string) => {
		logInfo({
			message: "Entering tryLoadTransaction Function.",
			meta: { transactionId, subscriberUrl },
			transaction_id: transactionId,
		});
		const key = this.createTransactionKey(transactionId, subscriberUrl);
		if (await this.checkIfTransactionExists(key)) {
			logInfo({
				message:
					"Exiting tryLoadTransaction Function. Transaction found in cache. Calling loadTransactionThatExists",
				meta: { transactionId, subscriberUrl },
				transaction_id: transactionId,
			});
			return this.loadTransactionThatExists(key);
		}
		logInfo({
			message:
				"Exiting tryLoadTransaction Function. Transaction not found in cache",
			meta: { transactionId, subscriberUrl },
			transaction_id: transactionId,
		});
		throw new Error(`Transaction with id ${key} not found in cache`);
	};
	checkIfTransactionExists = async (transSubKey: string) => {
		let exists = await RedisService.keyExists(transSubKey);
		// logger.info(
		// 	`cache for transaction with id ${transSubKey} exists ${exists}`
		// );
		logInfo({
			message: `Inside checkIfTransactionExists Function. Cache for transaction with id ${transSubKey} exists ${exists}`,
			meta: { transSubKey },
			transaction_id: transSubKey,
		});
		return exists;
	};
	loadTransactionThatExists = async (transSubKey: string) => {
		logInfo({
			message:
				"Entering loadTransactionThatExists Function. Loading transaction",
			meta: { transSubKey },
		});
		const rawData = await RedisService.getKey(transSubKey);
		if (!rawData) {
			// logger.error(`Transaction with id ${transSubKey} not found`);
			logInfo({
				message:
					"Exiting loadTransactionThatExists Function. Transaction not found",
				meta: { transSubKey },
			});
			throw new Error(`Transaction with id ${transSubKey} not found`);
		}
		logInfo({
			message:
				"Exiting loadTransactionThatExists Function. Transaction data loaded successfully",
			meta: { transSubKey },
		});
		return JSON.parse(rawData) as TransactionCache;
	};
	createTransactionKey = (transactionId: string, subscriberUrl: string) => {
		logInfo({
			message: "Inside createTransactionKey Function. Creating transaction key",
			meta: { transactionId, subscriberUrl },
		});
		return `${transactionId.trim()}::${subscriberUrl.trim()}`;
	};
}

export class SessionCacheService {
	checkIfSessionExists = async (sessionId?: string) => {
		logInfo({
			message:
				"Entering checkIfSessionExists Function. Checking if session exists",
			meta: { sessionId },
		});
		if (!sessionId) {
			// logger.error(`Session id is not provided`);
			logInfo({
				message:
					"Exiting checkIfSessionExists Function. Session id is not provided",
			});
			return false;
		}
		const exists = await RedisService.keyExists(sessionId);
		// logger.info(`cache for session with id ${sessionId} exists ${exists}`);
		logInfo({
			message: `Exiting checkIfSessionExists Function. Cache for session with id ${sessionId} exists ${exists}`,
			meta: { sessionId },
		});
		return exists;
	};
	loadSessionThatExists = async (sessionId: string) => {
		logInfo({
			message: "Entering loadSessionThatExists Function. Loading session data",
			meta: { sessionId },
		});
		const rawData = await RedisService.getKey(sessionId);
		if (!rawData) {
			// logger.error(`Session with id ${sessionId} not found`);
			logInfo({
				message:
					"Exiting loadSessionThatExists Function. Session with id ${sessionId} not found",
				meta: { sessionId },
			});
			throw new Error(`Session with id ${sessionId} not found`);
		}
		logInfo({
			message:
				"Exiting loadSessionThatExists Function. Session data loaded successfully",
			meta: { sessionId },
		});
		return JSON.parse(rawData) as SessionCache;
	};
	savedToCache = async (sessionId: string, data: SessionCache) => {
		try {
			await RedisService.setKey(sessionId, JSON.stringify(data));
		} catch (error) {
			logInfo({
				message: "Error while saving to cache",
				meta: { sessionId, error },
			});
			throw error;
		}
	};
}
