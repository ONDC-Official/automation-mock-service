import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { select_142_generator } from "./generator";

export class MockSelect142 extends MockAction {
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
		return "select";
	}
	get description(): string {
		return "Mock action for selecting items in a grocery order with scenario 142.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return select_142_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		// Select action validation
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

		if (targetPayload.message.order.items.length === 0) {
			return { valid: false, message: "Message.order.items cannot be empty" };
		}

		return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// Select requires transaction_id
		if (!sessionData.transaction_id) {
			return { valid: false, message: "Transaction ID is required for select action" };
		}

		// Select requires user_inputs with specific fields
		if (!sessionData.user_inputs) {
			return { valid: false, message: "User inputs are required for select action" };
		}

		// Check required fields in user_inputs
		if (!sessionData.user_inputs.provider) {
			return { valid: false, message: "Provider is required in user inputs for select action" };
		}

		if (!sessionData.user_inputs.provider_location) {
			return { valid: false, message: "Provider location is required in user inputs for select action" };
		}

		if (!sessionData.user_inputs.location_gps) {
			return { valid: false, message: "Location GPS coordinates are required in user inputs for select action" };
		}

		if (!sessionData.user_inputs.location_pin_code) {
			return { valid: false, message: "Location pin code is required in user inputs for select action" };
		}

		if (!sessionData.user_inputs.items || !Array.isArray(sessionData.user_inputs.items)) {
			return { valid: false, message: "Items array is required in user inputs for select action" };
		}

		if (sessionData.user_inputs.items.length === 0) {
			return { valid: false, message: "Items array cannot be empty in user inputs for select action" };
		}

		return { valid: true };
	}
}
