import { Flow } from "../types/flow-types";
import { FlowMap, MappedStep, ReducedApiData } from "../types/mapped-flow";
import { ApiData, TransactionCache } from "../types/transaction-cache";
import { MockStatusCode } from "./mock-flow-status-service";

export function getNextActionMetaData(
	transactionData: TransactionCache,
	flow: Flow,
	flowStatus: MockStatusCode
) {
	const flowDetails = getFlowCompleteStatus(transactionData, flow, flowStatus);
	const latestApi = flowDetails.sequence.find((s) =>
		["LISTENING", "RESPONDING", "INPUT-REQUIRED"].includes(s.status)
	);
	return latestApi;
}

export function getFlowCompleteStatus(
	transactionData: TransactionCache,
	flow: Flow,
	flowStatus: MockStatusCode
) {
	const apiList = reduceApiDataList(transactionData.apiList).sort(
		(a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
	);
	const subscriberType = transactionData.subscriberType;
	const mappedFlow: FlowMap = {
		sequence: [],
		missedSteps: [],
	};
	const flowSequence = flow.sequence;
	let i = 0;
	for (i = 0; i < apiList.length; i++) {
		const targetApiData = apiList[i];
		if (i < flowSequence.length) {
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
			mappedFlow.missedSteps.push({
				status: "COMPLETE",
				actionId: apiList[i].action,
				owner: apiList[i].action.startsWith("on_") ? "BPP" : "BAP",
				actionType: apiList[i].action,
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
			};
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

function reduceApiDataList(data: ApiData[]): ReducedApiData[] {
	const map = new Map<string, ReducedApiData>();

	for (const item of data) {
		const key = `${item.action}|${item.messageId}`;

		if (!map.has(key)) {
			map.set(key, {
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
			map
				.get(key)!
				.payloads.push({ payloadId: item.payloadId, response: item.response });
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
