import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { select_out_of_stock_generator } from "./generator";

export class MockSelectOutOfStock extends MockAction {
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
		return "Mock action for selecting items when out of stock in a grocery order.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return select_out_of_stock_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
			if (!targetPayload) return { valid: false, message: "Payload is required" };

			const order = targetPayload.message?.order;
			if (!order) return { valid: false, message: "Message.order is required" };
			if (!Array.isArray(order.items)) return { valid: false, message: "Order.items must be an array" };
			if (!order.quote?.breakup || !Array.isArray(order.quote.breakup)) {
				return { valid: false, message: "Order.quote.breakup is required and must be an array" };
			}

			for (const item of order.quote.breakup) {
				if (item["@ondc/org/title_type"] === "item") {
				const quantityCount = item["@ondc/org/item_quantity"]?.count;
				if (typeof quantityCount !== "number") {
					return { valid: false, message: `Item ${item["@ondc/org/item_id"]}: @ondc/org/item_quantity.count must be a number` };
				}
				if (quantityCount !== 0) {
					return { valid: false, message: `Item ${item["@ondc/org/item_id"]} must have count 0 for out-of-stock` };
				}
				}
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
