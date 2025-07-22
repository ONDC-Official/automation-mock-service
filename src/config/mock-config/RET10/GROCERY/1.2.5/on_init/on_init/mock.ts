import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_init_generator } from "./generator";

export class MockOnInit extends MockAction {
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
		return "Mock action for on_init response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_init_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) {
			return { valid: false, message: "Payload is required" };
		}

		if (!targetPayload.message) {
			return { valid: false, message: "Message is required" };
		}

		if (!targetPayload.message.order) {
			return { valid: false, message: "Message.order is required" };
		}

		const { order } = targetPayload.message;

		if (!order.billing) {
			return { valid: false, message: "Message.order.billing is required" };
		}

		if (!order.fulfillment && !order.fulfillments) {
			return { valid: false, message: "Message.order.fulfillment or fulfillments is required" };
		}

		return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		if (!sessionData.transaction_id) {
			return { valid: false, message: "transaction_id is required" };
		}
		if (!sessionData.items || !Array.isArray(sessionData.items)) {
			return { valid: false, message: "items array is required" };
		}
		if (!sessionData.billing) {
			return { valid: false, message: "billing is required" };
		}
		if (!sessionData.provider) {
			return { valid: false, message: "provider is required" };
		}
		if (!sessionData.quote) {
			return { valid: false, message: "quote is required" };
		}
		if (!sessionData.fulfillments || !Array.isArray(sessionData.fulfillments)) {
			return { valid: false, message: "fulfillments array is required" };
		}
		return { valid: true };
	}
}