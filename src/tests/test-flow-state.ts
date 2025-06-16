import { getFlowCompleteStatus } from "../services/flow-mapping-service";
import { Flow } from "../types/flow-types";
import { TransactionCache } from "../types/transaction-cache";

const tsData: TransactionCache = {
	sessionId: "DYeL9CoMFP3D4M-RO0YGRxZGHJ6Ra-EY",
	flowId: "OnDemand_Assign_driver_post_onconfirm",
	latestAction: "track",
	subscriberType: "BAP",
	latestTimestamp: "2025-04-22T09:03:27.702Z",
	type: "manual",
	messageIds: [],
	apiList: [
		{
			action: "search",
			messageId: "4b91b409-3f29-410f-8292-138b9730b0aa",
			payloadId: "1f27654f-7cc3-4a94-8e16-ce31527091e4",
			response: {
				message: {
					ack: {
						status: "ACK",
					},
				},
			},
			timestamp: "2025-04-22T09:02:17.727Z",
		},
		{
			action: "on_search",
			messageId: "4b91b409-3f29-410f-8292-138b9730b0aa",
			payloadId: "361c7c01-50ef-47d7-86f6-c5c95b9a04ff",
			response: {
				message: {
					ack: {
						status: "ACK",
					},
				},
			},
			timestamp: "2025-04-22T09:02:20.847Z",
		},
		{
			action: "select",
			messageId: "84afc490-6110-4083-83dc-e861ba499777",
			payloadId: "125f3fc5-969d-48be-8f58-d935ae21a508",
			response: {
				message: {
					ack: {
						status: "ACK",
					},
				},
			},
			timestamp: "2025-04-22T09:02:23.455Z",
		},
		{
			action: "on_select",
			messageId: "84afc490-6110-4083-83dc-e861ba499777",
			payloadId: "be5d20e2-092d-4a36-8fd0-128b191dd40c",
			response: {
				message: {
					ack: {
						status: "ACK",
					},
				},
			},
			timestamp: "2025-04-22T09:02:37.251Z",
		},
		{
			action: "init",
			messageId: "08a8e73e-20de-45b2-8126-4dc98ec314f2",
			payloadId: "fdc42eca-6215-4f37-adc4-7e5be3bf1d78",
			response: {
				message: {
					ack: {
						status: "ACK",
					},
				},
			},
			timestamp: "2025-04-22T09:02:52.967Z",
		},
		{
			action: "on_init",
			messageId: "08a8e73e-20de-45b2-8126-4dc98ec314f2",
			payloadId: "20573baf-b611-457f-aede-d584719b7c09",
			response: {
				message: {
					ack: {
						status: "ACK",
					},
				},
			},
			timestamp: "2025-04-22T09:03:01.347Z",
		},
		{
			action: "confirm",
			messageId: "fb9ac339-4fd1-48a4-905e-f80685f9eecc",
			payloadId: "863ba06d-811c-405e-8f57-bf7bc8c018d3",
			response: {
				message: {
					ack: {
						status: "ACK",
					},
				},
			},
			timestamp: "2025-04-22T09:03:06.735Z",
		},
		{
			action: "on_confirm",
			messageId: "fb9ac339-4fd1-48a4-905e-f80685f9eecc",
			payloadId: "21dc8cef-bd56-4c20-927e-4fe50f7f0d81",
			response: {
				message: {
					ack: {
						status: "ACK",
					},
				},
			},
			timestamp: "2025-04-22T09:03:13.870Z",
		},
		{
			action: "on_update",
			messageId: "8fbf0556-4b85-48c9-8f78-680915db94db",
			payloadId: "4302883d-2cc2-420e-bc2d-e74524ed7d36",
			response: {
				message: {
					ack: {
						status: "ACK",
					},
				},
			},
			timestamp: "2025-04-22T09:03:20.238Z",
		},
		{
			action: "on_update",
			messageId: "7f0d8835-c48a-4d7b-82ee-17407845ea0f",
			payloadId: "df125826-aa8c-438b-b064-8b8e0e183708",
			response: {
				message: {
					ack: {
						status: "NACK",
					},
				},
				error: {
					code: "400",
					message: "on_update not supported after on_update",
				},
			},
			timestamp: "2025-04-22T09:03:23.581Z",
		},
		{
			action: "track",
			messageId: "a5a79879-fefe-4a07-ba45-0c55e2d969ca",
			payloadId: "1e09a237-0e1f-46f5-acad-5e6cabbb7821",
			response: {
				message: {
					ack: {
						status: "NACK",
					},
				},
				error: {
					code: "400",
					message: "flow history already has a failed response",
				},
			},
			timestamp: "2025-04-22T09:03:27.702Z",
		},
	],
};
const flow: Flow = {
	id: "OnDemand_Assign_driver_on_onconfirm",
	description: "On-Demand - Assign driver on on-confirm",
	sequence: [
		{
			key: "search_ride",
			type: "search",
			unsolicited: false,
			pair: "on_search",
			owner: "BAP",
			expect: true,
			input: [
				{
					name: "city_code",
					label: "Enter city code",
					type: "text",
					payloadField: "$.context.location.city.code",
				},
				{
					name: "start_gps",
					label: "Enter start gps coordinates",
					type: "text",
					payloadField:
						"$.message.intent.fulfillment.stops[?(@.type=='START')].location.gps",
				},
				{
					name: "end_gps",
					label: "Enter end gps coordinates",
					type: "text",
					payloadField:
						"$.message.intent.fulfillment.stops[?(@.type=='END')].location.gps",
				},
			],
		},
		{
			key: "on_search",
			type: "on_search",
			unsolicited: false,
			pair: null,
			owner: "BPP",
			expect: false,
		},
		{
			key: "select",
			type: "select",
			unsolicited: false,
			pair: "on_select",
			owner: "BAP",
			expect: false,
		},
		{
			key: "on_select",
			type: "on_select",
			unsolicited: false,
			pair: null,
			owner: "BPP",
			expect: false,
		},
		{
			key: "init",
			type: "init",
			unsolicited: false,
			pair: "on_init",
			owner: "BAP",
			expect: false,
		},
		{
			key: "on_init",
			type: "on_init",
			unsolicited: false,
			pair: null,
			owner: "BPP",
			expect: false,
		},
		{
			key: "confirm",
			type: "confirm",
			unsolicited: false,
			pair: "on_confirm",
			owner: "BAP",
			expect: false,
		},
		{
			key: "on_confirm",
			type: "on_confirm",
			unsolicited: false,
			pair: null,
			owner: "BPP",
			expect: false,
		},
		{
			key: "on_status_unsolicited",
			type: "on_status",
			unsolicited: true,
			pair: null,
			owner: "BPP",
			expect: false,
		},
		{
			key: "track_ride",
			type: "track",
			unsolicited: false,
			pair: "on_track_ride",
			owner: "BAP",
			expect: false,
		},
		{
			key: "on_track_ride",
			type: "on_track",
			unsolicited: false,
			pair: null,
			owner: "BPP",
			expect: false,
		},
		{
			key: "on_status_ride_arrived",
			type: "on_status",
			unsolicited: true,
			pair: null,
			owner: "BPP",
			expect: false,
		},
		{
			key: "on_status_ride_started",
			type: "on_status",
			unsolicited: true,
			pair: null,
			owner: "BPP",
			expect: false,
		},
		{
			key: "on_update",
			type: "on_update",
			unsolicited: true,
			pair: null,
			owner: "BPP",
			expect: false,
		},
		{
			key: "status",
			type: "status",
			unsolicited: false,
			pair: "on_status_solicited",
			owner: "BAP",
			expect: false,
		},
		{
			key: "on_status_solicited",
			type: "on_status",
			unsolicited: false,
			pair: null,
			owner: "BPP",
			expect: false,
		},
	],
};

console.log(JSON.stringify(getFlowCompleteStatus(tsData, flow)));
