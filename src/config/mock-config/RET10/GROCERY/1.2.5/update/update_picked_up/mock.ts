import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { update_picked_up_generator } from "./generator";

export class MockUpdatePickedUp extends MockAction {
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
		return "Mock action for updating order as picked up.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return update_picked_up_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };

			if (targetPayload.message?.update_target !== "fulfillment") {
				return { valid: false, message: "update_target must be 'fulfillment'" };
			}

			const order = targetPayload.message?.order;
			if (!order || !order.id) {
				return { valid: false, message: "Order and order.id are required" };
			}

			const fulfillment = order.fulfillments?.[0];
			if (!fulfillment || fulfillment.type !== "Buyer-Delivery") {
				return { valid: false, message: "A Buyer-Delivery fulfillment is required" };
			}

			if (!fulfillment.id) {
				return { valid: false, message: "fulfillment.id is required" };
			}

			const tags = fulfillment.tags || [];

			const updateStateTag = tags.find((tag: any) => tag.code === "update_state");
			const stateValue = updateStateTag?.list?.find((entry: any) => entry.code === "state")?.value;
			if (stateValue !== "Order-picked-up") {
				return { valid: false, message: "update_state.state must be 'Order-picked-up'" };
			}

			const updateTimeTag = tags.find((tag: any) => tag.code === "update_fulfillment_time");
			const timeState = updateTimeTag?.list?.find((entry: any) => entry.code === "state")?.value;
			const timeStamp = updateTimeTag?.list?.find((entry: any) => entry.code === "timestamp")?.value;
			if (timeState !== "Order-picked-up" || !timeStamp) {
				return { valid: false, message: "update_fulfillment_time must contain 'state' = 'Order-picked-up' and a valid timestamp" };
			}

			const agentTag = tags.find((tag: any) => tag.code === "update_agent_details");
			const agentName = agentTag?.list?.find((entry: any) => entry.code === "name")?.value;
			const agentPhone = agentTag?.list?.find((entry: any) => entry.code === "phone")?.value;
			if (!agentName || !agentPhone) {
				return { valid: false, message: "update_agent_details must contain both 'name' and 'phone'" };
			}

			const requiredBnpTags = ["bnp_diff_weight", "bnp_diff_length", "bnp_diff_breadth", "bnp_diff_height"];
			for (const tagCode of requiredBnpTags) {
				const tag = tags.find((t: any) => t.code === tagCode);
				const unit = tag?.list?.find((e: any) => e.code === "unit")?.value;
				const value = tag?.list?.find((e: any) => e.code === "value")?.value;
				if (!unit || isNaN(Number(value))) {
				return { valid: false, message: `Tag '${tagCode}' must contain 'unit' and numeric 'value'` };
				}
			}

			return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// Update requires transaction_id, order_id, and fulfillments
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