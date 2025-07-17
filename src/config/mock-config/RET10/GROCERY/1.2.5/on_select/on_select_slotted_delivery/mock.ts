import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_select_slotted_delivery_generator } from "./generator";

export class MockOnSelectSlottedDelivery extends MockAction {
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
		return "on_select";
	}
	get description(): string {
		return "Mock action for on_select_slotted_delivery response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_select_slotted_delivery_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		// On_select action validation
		if (!targetPayload) {
			return { valid: false, message: "Payload is required" };
		}

		// Check if message exists
		if (!targetPayload.message) {
			return { valid: false, message: "Message is required" };
		}

		// Check if order object exists with items array
		if (!targetPayload.message.order) {
			return { valid: false, message: "Message.order is required" };
		}

		if (!targetPayload.message.order.items || !Array.isArray(targetPayload.message.order.items)) {
			return { valid: false, message: "Message.order.items array is required" };
		}

		return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// on_select requires transaction_id and selected_items
		if (!sessionData.transaction_id) {
			return { valid: false, message: "transaction_id is required" };
		}
		if (!sessionData.selected_items || !Array.isArray(sessionData.selected_items)) {
			return { valid: false, message: "selected_items array is required" };
		}
		return { valid: true };
	}
}