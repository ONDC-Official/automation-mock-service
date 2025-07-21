import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { cancel_force_generator } from "./generator";

export class MockCancelForce extends MockAction {
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
		return "cancel";
	}
	get description(): string {
		return "Mock action for force cancel scenario.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return cancel_force_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		// Cancel action validation
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

		// Check for cancellation object
		if (!order.cancellation && !targetPayload.message.cancellation) {
			return { valid: false, message: "Cancellation object is required" };
		}

		return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// Cancel requires transaction_id, order_id, and cancellation_reason_id
		if (!sessionData.transaction_id) {
			return { valid: false, message: "Transaction ID is required for cancel action" };
		}

		if (!sessionData.order_id) {
			return { valid: false, message: "Order ID is required for cancel action" };
		}

		if (!sessionData.cancellation_reason_id) {
			return { valid: false, message: "Cancellation reason ID is required for cancel action" };
		}

		return { valid: true };
	}
}