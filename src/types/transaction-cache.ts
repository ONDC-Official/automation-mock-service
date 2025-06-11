export interface ApiData {
	action: string;
	payloadId: string;
	messageId: string;
	response: any;
	timestamp: string;
}
export interface TransactionCache {
	sessionId?: string;
	flowId?: string;
	latestAction: string;
	latestTimestamp: string;
	type: "default" | "manual";
	subscriberType: "BAP" | "BPP";
	messageIds: string[];
	apiList: ApiData[];
}
