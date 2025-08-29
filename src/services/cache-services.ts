import { RedisService } from "ondc-automation-cache-lib";
import { TransactionCache } from "../types/transaction-cache";
import { SessionCache } from "../types/api-session-cache";
import logger from "@ondc/automation-logger";

export class TransactionCacheService {
	tryLoadTransaction = async (transactionId: string, subscriberUrl: string) => {
		const key = this.createTransactionKey(transactionId, subscriberUrl);
		if (await this.checkIfTransactionExists(key)) {
			return this.loadTransactionThatExists(key);
		}
		throw new Error(`Transaction with id ${key} not found in cache`);
	};
	checkIfTransactionExists = async (transSubKey: string) => {
		let exists = await RedisService.keyExists(transSubKey);
		logger.info(
			`cache for transaction with id ${transSubKey} exists ${exists}`
		);
		return exists;
	};
	loadTransactionThatExists = async (transSubKey: string) => {
		const rawData = await RedisService.getKey(transSubKey);
		if (!rawData) {
			throw new Error(`Transaction with id ${transSubKey} not found`);
		}
		return JSON.parse(rawData) as TransactionCache;
	};
	createTransactionKey = (transactionId: string, subscriberUrl: string) => {
		return `${transactionId.trim()}::${subscriberUrl.trim()}`;
	};
}

export class SessionCacheService {
	checkIfSessionExists = async (sessionId?: string) => {
		if (!sessionId) {
			logger.error(`Session id is not provided`);
			return false;
		}
		const exists = await RedisService.keyExists(sessionId);
		return exists;
	};
	loadSessionThatExists = async (sessionId: string) => {
		const rawData = await RedisService.getKey(sessionId);
		if (!rawData) {
			throw new Error(`Session with id ${sessionId} not found`);
		}
		return JSON.parse(rawData) as SessionCache;
	};
	savedToCache = async (sessionId: string, data: SessionCache) => {
		try {
			await RedisService.setKey(sessionId, JSON.stringify(data));
		} catch (error) {
			logger.error(`Error while saving session data to cache`, {}, error);
			throw error;
		}
	};
}
