import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_update_buyer_instructions } from "./generator";

export class MockOnUpdateBuyerInstructions extends MockAction {
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
		return "on_update";
	}
	get description(): string {
		return "Mock action for on_update_buyer_instructions response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_update_buyer_instructions(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		// On_update action validation
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

		// Check for order ID
		if (!order.id) {
			return { valid: false, message: "Message.order.id is required" };
		}

		// Check for update_target
		if (!targetPayload.message.update_target) {
			return { valid: false, message: "Message.update_target is required" };
		}

		return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// on_update requires transaction_id and order
		if (!sessionData.transaction_id) {
			return { valid: false, message: "transaction_id is required" };
		}
		if (!sessionData.order || typeof sessionData.order !== 'object') {
			return { valid: false, message: "order object is required" };
		}
		return { valid: true };
	}
}