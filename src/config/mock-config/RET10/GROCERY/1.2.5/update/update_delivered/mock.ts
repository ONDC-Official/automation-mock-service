import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { update_delivered_generator } from "./generator";
 
export class MockUpdateDelivered extends MockAction {
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
		return "update";
	}
	get description(): string {
		return "Mock action for updating order as delivered.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return update_delivered_generator(existingPayload, sessionData);
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

		if (!order.id) {
			return { valid: false, message: "Message.order.id is required" };
		}

		if (!targetPayload.message.update_target) {
			return { valid: false, message: "Message.update_target is required" };
		}

		return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		if (!sessionData.transaction_id) {
			return { valid: false, message: "Transaction ID is required for update action" };
		}

		if (!sessionData.order_id) {
			return { valid: false, message: "Order ID is required for update action" };
		}

		if (!sessionData.fulfillments || sessionData.fulfillments.length === 0) {
			return { valid: false, message: "Fulfillments are required for update action" };
		}

		return { valid: true };
	}
}