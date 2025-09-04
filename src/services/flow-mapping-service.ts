import { MockSessionData } from "../config/mock-config";
import { Flow, SequenceStep } from "../types/flow-types";
import {
	ApiHistory,
	FlowMap,
	MappedStep,
	ReducedApiData,
	ReduceFormData,
} from "../types/mapped-flow";
import {
	FormApiType,
	HistoryType,
	TransactionCache,
} from "../types/transaction-cache";
import { getReferenceData } from "./data-services";
import { MockStatusCode } from "./mock-flow-status-service";
import logger from "@ondc/automation-logger";
export function getNextActionMetaData(
	transactionData: TransactionCache,
	flow: Flow,
	flowStatus: MockStatusCode,
	mockSessionData: MockSessionData
) {
	const flowDetails = getFlowCompleteStatus(
		transactionData,
		flow,
		flowStatus,
		mockSessionData
	);
	const latestApi = flowDetails.sequence.find((s) =>
		[
			"LISTENING",
			"RESPONDING",
			"INPUT-REQUIRED",
			"WAITING-SUBMISSION",
		].includes(s.status)
	);
	logger.info("Latest Action Meta Data", { latestApi });
	return latestApi;
}

export function getFlowCompleteStatus(
	transactionData: TransactionCache,
	flow: Flow,
	flowStatus: MockStatusCode,
	mockSessionData: MockSessionData
) {
	const apiList = reduceApiDataList(transactionData.apiList).sort(
		(a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
	);
	const subscriberType = transactionData.subscriberType;
	const mappedFlow: FlowMap = {
		sequence: [],
		missedSteps: [],
		reference_data: getReferenceData(mockSessionData),
	};
	const flowSequence = flow.sequence;
	let i = 0;
	for (i = 0; i < apiList.length; i++) {
		const data = apiList[i];
		if (data.entryType === "API") {
			handleApiSequence(i, flowSequence, data, mappedFlow, apiList);
		} else {
			handleFormSequence(i, flowSequence, data, mappedFlow, apiList);
		}
	}

	i = mappedFlow.sequence.length;
	for (i; i < flowSequence.length; i++) {
		if (
			i === 0 ||
			(i !== 0 &&
				i === apiList.length &&
				mappedFlow.sequence[i - 1].payloads &&
				mappedFlow.sequence[i - 1].payloads?.subStatus === "SUCCESS")
		) {
			const item = flowSequence[i];

			const base: MappedStep = {
				status: "LISTENING",
				actionId: item.key,
				owner: item.owner,
				actionType: item.type,
				input: item.input,
				index: i,
				unsolicited: item.unsolicited,
				pairActionId: item.pair,
				description: item.description,
				expect: item.expect,
				label: item.label,
				force_proceed: item.force_proceed,
			};
			if (item.type === "HTML_FORM") {
				if (subscriberType === item.owner) {
					mappedFlow.sequence.push({
						...base,
						status:
							flowStatus === "AVAILABLE" ? "INPUT-REQUIRED" : "PROCESSING",
					});
				} else {
					mappedFlow.sequence.push({
						...base,
						status:
							flowStatus === "AVAILABLE" ? "WAITING-SUBMISSION" : "RESPONDING",
					});
				}
				continue;
			}
			if (subscriberType === item.owner) {
				mappedFlow.sequence.push(base);
			} else {
				if (item.input) {
					mappedFlow.sequence.push({
						...base,
						status:
							flowStatus === "AVAILABLE" ? "INPUT-REQUIRED" : "RESPONDING",
					});
				} else {
					if (item.unsolicited) {
						mappedFlow.sequence.push({
							...base,
							status:
								flowStatus === "AVAILABLE" ? "INPUT-REQUIRED" : "RESPONDING",
							input: [],
						});
					}
					mappedFlow.sequence.push({
						...base,
						status: "RESPONDING",
					});
				}
			}
		} else {
			const item = flowSequence[i];
			mappedFlow.sequence.push({
				status: "WAITING",
				actionId: item.key,
				owner: item.owner,
				actionType: item.type,
				input: item.input,
				index: i,
				unsolicited: item.unsolicited,
				pairActionId: item.pair,
				description: item.description,
				expect: item.expect,
				label: item.label,
			});
		}
	}
	return mappedFlow;
}

function handleApiSequence(
	i: number,
	flowSequence: SequenceStep[],
	data: ReducedApiData,
	mappedFlow: FlowMap,
	apiList: ApiHistory[]
) {
	if (i < flowSequence.length) {
		const targetApiData = data;
		const flowStep = flowSequence[i];
		if (flowStep.type === targetApiData.action) {
			mappedFlow.sequence.push({
				status: "COMPLETE",
				actionId: flowStep.key,
				owner: flowStep.owner,
				actionType: flowStep.type,
				input: flowStep.input,
				payloads: targetApiData,
				index: i,
				unsolicited: flowStep.unsolicited,
				pairActionId: flowStep.pair,
				description: flowStep.description,
				label: flowStep.label,
			});
		} else {
			mappedFlow.missedSteps.push({
				status: "COMPLETE",
				actionId: targetApiData.action,
				owner: targetApiData.action.startsWith("on_") ? "BPP" : "BAP",
				actionType: targetApiData.action,
				input: undefined,
				index: -1,
				unsolicited: false,
				pairActionId: null,
				description: "action miss match from flow",
				missedStep: true,
				payloads: targetApiData,
			});
		}
	} else {
		const targetApiData = data;
		mappedFlow.missedSteps.push({
			status: "COMPLETE",
			actionId: targetApiData.action,
			owner: targetApiData.action.startsWith("on_") ? "BPP" : "BAP",
			actionType: targetApiData.action,
			input: undefined,
			index: -1,
			unsolicited: false,
			pairActionId: null,
			payloads: apiList[i],
			description: "action beyond flow",
			missedStep: true,
		});
	}
}

function handleFormSequence(
	i: number,
	flowSequence: SequenceStep[],
	data: ReduceFormData,
	mappedFlow: FlowMap,
	apiList: ApiHistory[]
) {
	if (i < flowSequence.length) {
		const targetFormData = data;
		const flowStep = flowSequence[i];
		if (flowStep.type === targetFormData.formType) {
			mappedFlow.sequence.push({
				status: "COMPLETE",
				actionId: flowStep.key,
				owner: flowStep.owner,
				actionType: flowStep.type,
				input: flowStep.input,
				index: i,
				unsolicited: flowStep.unsolicited,
				pairActionId: flowStep.pair,
				description: flowStep.description,
				label: flowStep.label,
				payloads: targetFormData,
			});
		} else {
			mappedFlow.missedSteps.push({
				status: "COMPLETE",
				actionId: targetFormData.formId,
				owner: "BAP",
				actionType: targetFormData.formType,
				input: undefined,
				index: -1,
				unsolicited: false,
				pairActionId: null,
				description: "form miss match from flow",
				missedStep: true,
				payloads: targetFormData,
			});
		}
	} else {
		const targetFormData = data;
		mappedFlow.missedSteps.push({
			status: "COMPLETE",
			actionId: targetFormData.formId,
			owner: "BAP",
			actionType: targetFormData.formType,
			input: undefined,
			index: -1,
			unsolicited: false,
			pairActionId: null,
			payloads: apiList[i],
			description: "form beyond flow",
			missedStep: true,
		});
	}
}

function reduceApiDataList(data: HistoryType[]): ApiHistory[] {
	const map = new Map<string, ApiHistory>();

	for (const vagueItem of data) {
		if (vagueItem.entryType === "FORM") {
			const item = vagueItem as FormApiType;
			const key = `${item.formType}|${item.formId}|${item.submissionId}`;
			if (!map.has(key)) {
				map.set(key, {
					entryType: "FORM",
					formType: item.formType,
					formId: item.formId,
					submissionId: item.submissionId,
					timestamp: item.timestamp,
					subStatus: item.error ? "ERROR" : "SUCCESS",
					error: item.error,
				});
			}
		} else {
			const item = vagueItem;
			const key = `${item.action}|${item.messageId}`;
			if (!map.has(key)) {
				map.set(key, {
					entryType: "API",
					action: item.action,
					messageId: item.messageId,
					timestamp: item.timestamp,
					subStatus: checkPerfectAck(item.response),
					payloads: [
						{
							payloadId: item.payloadId,
							response: item.response,
						},
					],
				});
			} else {
				const existingItem = map.get(key)! as ReducedApiData;
				existingItem.payloads.push({
					payloadId: item.payloadId,
					response: item.response,
				});
			}
		}
	}
	return Array.from(map.values());
}

function checkPerfectAck(response: any): "SUCCESS" | "ERROR" {
	if (response?.message?.ack?.status === "ACK") {
		return "SUCCESS";
	}
	return "ERROR";
}
