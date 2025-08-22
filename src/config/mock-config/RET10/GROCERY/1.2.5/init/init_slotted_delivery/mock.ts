import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { init_slotted_delivery_generator } from "./generator";

export class MockInitSlottedDelivery extends MockAction {
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
		return "init";
	}
	get description(): string {
		return "Mock action for initializing order in a grocery with slotted delivery.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return init_slotted_delivery_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
			const order = targetPayload.message?.order;
			if (!order) return { valid: false, message: "Message.order is required" };

			const items = order.items || [];
			const fulfillments = order.fulfillments || [];

			if (!items.length) return { valid: false, message: "Order.items is required" };
			if (!fulfillments.length) return { valid: false, message: "Order.fulfillments is required" };

			for (const item of items) {
				if (!item.fulfillment_id) return { valid: false, message: `Item ${item.id} must have a fulfillment_id` };

				const fulfillment = fulfillments.find((f: { id: any; type: string; }) => f.id === item.fulfillment_id && f.type === "Delivery");
				if (!fulfillment) return { valid: false, message: `Delivery fulfillment ${item.fulfillment_id} not found` };
			}

			return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// Init requires transaction_id, selected_items, on_select_fulfillments, provider
		if (!sessionData.transaction_id) {
			return { valid: false, message: "Transaction ID is required for init action" };
		}

		if (!sessionData.selected_items || !Array.isArray(sessionData.selected_items)) {
			return { valid: false, message: "Selected items array is required for init action" };
		}

		if (!sessionData.on_select_fulfillments || !Array.isArray(sessionData.on_select_fulfillments)) {
			return { valid: false, message: "On select fulfillments array is required for init action" };
		}

		if (!sessionData.selected_offers || !Array.isArray(sessionData.selected_offers)) {
			return { valid: false, message: "Selected Offers is required for init action" };
		}

		if (!sessionData.provider || typeof sessionData.provider !== 'object') {
			return { valid: false, message: "Provider object is required for init action" };
		}

		return { valid: true };
	}
}