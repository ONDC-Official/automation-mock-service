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
		if (!targetPayload) return { valid: false, message: "Payload is required" };

			if (targetPayload.message?.update_target !== "fulfillment") {
				return { valid: false, message: "update_target must be 'fulfillment'" };
			}

			const order = targetPayload.message?.order;
			if (!order || !order.id) {
				return { valid: false, message: "order and order.id are required" };
			}

			const fulfillment = order.fulfillments?.[0];
			if (!fulfillment || fulfillment.type !== "Order-delivered") {
				return { valid: false, message: "fulfillment.type must be 'Order-delivered'" };
			}

			if (!fulfillment.id) {
				return { valid: false, message: "fulfillment.id is required" };
			}

			const tags = fulfillment.tags || [];

			const updateStateTag = tags.find((tag: any) => tag.code === "update_state");
			const stateValue = updateStateTag?.list?.find((entry: any) => entry.code === "state")?.value;
			if (stateValue !== "Order-delivered") {
				return { valid: false, message: "update_state.state must be 'Order-delivered'" };
			}

			const updateTimeTag = tags.find((tag: any) => tag.code === "update_fulfillment_time");
			const timeState = updateTimeTag?.list?.find((entry: any) => entry.code === "state")?.value;
			const timeStamp = updateTimeTag?.list?.find((entry: any) => entry.code === "timestamp")?.value;
			if (timeState !== "Order-delivered" || !timeStamp) {
				return { valid: false, message: "update_fulfillment_time must contain 'state' = 'Order-delivered' and a valid timestamp" };
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