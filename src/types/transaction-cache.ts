export interface ApiData {
	entryType: "API";
	action: string;
	payloadId: string;
	messageId: string;
	response: any;
	timestamp: string;
}

export interface FormApiType {
	entryType: "FORM";
	formType: "HTML_FORM" | "HTML_FORM_MULTI" | "RES_FROM";
	formId: string;
	submissionId?: string;
	timestamp: string;
	error?: any;
}

export type HistoryType = FormApiType | ApiData;

export interface TransactionCache {
	sessionId?: string;
	flowId?: string;
	latestAction: string;
	latestTimestamp: string;
	type: "default" | "manual";
	subscriberType: "BAP" | "BPP";
	messageIds: string[];
	apiList: HistoryType[];
}
