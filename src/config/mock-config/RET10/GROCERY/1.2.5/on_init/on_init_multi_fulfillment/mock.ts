import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_init_multi_fulfillment_generator } from "./generator";

export class MockOnInitMultiFulfillment extends MockAction {
	get saveData(): saveType {
		return yaml.load(
			readFileSync(path.resolve(__dirname, "../save-data.yaml"), "utf8")
		) as saveType;
	}
	get defaultData(): any {
		return yaml.load(
			readFileSync(path.resolve(__dirname, "./default.yaml"), "utf8")
		);
	}
	get inputs(): any {
		return {};
	}
	name(): string {
		return "on_init";
	}
	get description(): string {
		return "Mock action for on_init_multi_fulfillment response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_init_multi_fulfillment_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		// On_init action validation
		if (!targetPayload) {
			return { valid: false, message: "Payload is required" };
		}

		// Check if message exists
		if (!targetPayload.message) {
			return { valid: false, message: "Message is required" };
		}

		// Check if order exists
		if (!targetPayload.message.order) {
			return { valid: false, message: "Message.order is required" };
		}

		const { order } = targetPayload.message;

		// Check for billing object
		if (!order.billing) {
			return { valid: false, message: "Message.order.billing is required" };
		}

		// Check for fulfillment object/array
		if (!order.fulfillment && !order.fulfillments) {
			return { valid: false, message: "Message.order.fulfillment or fulfillments is required" };
		}

		return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// on_init requires transaction_id, items, billing, provider, and quote
		if (!sessionData.transaction_id) {
			return { valid: false, message: "transaction_id is required" };
		}
		if (!sessionData.items || !Array.isArray(sessionData.items)) {
			return { valid: false, message: "items array is required" };
		}
		if (!sessionData.protocol_session_id) {
			return { valid: false, message: "protocol_session_id is required" };
		}
		return { valid: true };
	}
}