import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_select_buyer_delivery_generator } from "./generator";

export class MockOnSelectBuyerDelivery extends MockAction {
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
		return "Mock action for on_select_buyer_delivery response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_select_buyer_delivery_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };

		const message = targetPayload.message;
	  
		if (!message || !message.order) return { valid: false, message: "Message.order is required" };
	  
		const { order } = message;
	  
		if (!Array.isArray(order.items) || order.items.length === 0) {
		  return { valid: false, message: "Order.items must be a non-empty array" };
		}
	  
		if (!Array.isArray(order.fulfillments) || order.fulfillments.length === 0) {
		  return { valid: false, message: "Order.fulfillments must be a non-empty array" };
		}
	  
		const fulfillment = order.fulfillments.find((f: any) => f.type === "Buyer-Delivery");
		if (!fulfillment) return { valid: false, message: "Buyer-Delivery fulfillment is required" };
	  
		if (!fulfillment.id) return { valid: false, message: "Fulfillment.id is required" };
		if (!fulfillment["@ondc/org/TAT"]) return { valid: false, message: "Fulfillment @ondc/org/TAT is required" };
	  
		if (!fulfillment.state?.descriptor?.code || fulfillment.state.descriptor.code !== "Serviceable") {
		  return { valid: false, message: "Fulfillment.state.descriptor.code must be 'Serviceable'" };
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