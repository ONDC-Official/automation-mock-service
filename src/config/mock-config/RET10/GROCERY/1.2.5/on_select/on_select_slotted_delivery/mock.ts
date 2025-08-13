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
		if (!targetPayload) return { valid: false, message: "Payload is required" };

		const order = targetPayload.message?.order;
		if (!order) return { valid: false, message: "Message.order is required" };
		if (!Array.isArray(order.fulfillments)) return { valid: false, message: "Order.fulfillments must be an array" };
	  
		for (const fulfillment of order.fulfillments) {
		  if (!fulfillment.id) return { valid: false, message: "Fulfillment.id is required" };
		  if (!fulfillment.type) return { valid: false, message: `Fulfillment ${fulfillment.id}: type is required` };
	  
		  const tat = fulfillment["@ondc/org/TAT"];
		  if (!tat) return { valid: false, message: `Fulfillment ${fulfillment.id}: @ondc/org/TAT is required` };
	  
		  if (fulfillment.type === "Delivery" && fulfillment.end) {
			if (!fulfillment.end?.time?.range?.start || !fulfillment.end?.time?.range?.end) {
			  return { valid: false, message: `Fulfillment ${fulfillment.id}: end.time.range.start and end are required for Delivery` };
			}
		  } else if (fulfillment.type === "Self-Pickup") {
			if (!fulfillment.start?.time?.range?.start || !fulfillment.start?.time?.range?.end) {
			  return { valid: false, message: `Fulfillment ${fulfillment.id}: start.time.range.start and end are required for Self-Pickup` };
			}
		  } else {
			return { valid: false, message: `Fulfillment ${fulfillment.id}: type must be Delivery or Self-Pickup` };
		  }
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