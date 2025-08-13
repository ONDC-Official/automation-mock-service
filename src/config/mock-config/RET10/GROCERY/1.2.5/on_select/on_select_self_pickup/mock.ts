import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_select_self_pickup_generator } from "./generator";

export class MockOnSelectSelfPickup extends MockAction {
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
		return "Mock action for on_select_self_pickup response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_select_self_pickup_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };

			const message = targetPayload.message;

			if (!message?.order) return { valid: false, message: "Message.order is required" };
			const { order } = message;

			if (!Array.isArray(order.items) || order.items.length === 0) {
				return { valid: false, message: "Order.items must be a non-empty array" };
			}

			if (!Array.isArray(order.fulfillments) || order.fulfillments.length === 0) {
				return { valid: false, message: "Order.fulfillments must be a non-empty array" };
			}

			const fulfillmentIds: string[] = [];

			for (const item of order.items) {
				if (!item.fulfillment_id) continue;
			
				const matchedFulfillment = order.fulfillments.find((f: {
					[x: string]: string; id: any; 
						}) => f.id === item.fulfillment_id && f.type == "Self-Pickup");
		         if (matchedFulfillment){
                   if (matchedFulfillment.type !== "Self-Pickup") {
						 return { valid: false, message: `Fulfillment ${matchedFulfillment.id}: type must be 'Self-Pickup'` };
					 }
					 if (!["Takeaway", "Kerbside"].includes(matchedFulfillment["@ondc/org/category"])) {
						 return { valid: false, message: `Fulfillment ${matchedFulfillment.id}: @ondc/org/category must be 'Takeaway' or 'Kerbside'` };
					 }
					 if (matchedFulfillment.state?.descriptor?.code !== "Serviceable") {
						 return { valid: false, message: `Fulfillment ${matchedFulfillment.id}: state.descriptor.code must be 'Serviceable'` };
					 }
				 }
			}
			

			const breakup = order.quote?.breakup;
			if (!Array.isArray(breakup) || breakup.length === 0) {
				return { valid: false, message: "Order.quote.breakup must be a non-empty array" };
			}

			const matchedFulfillmentIds = new Set<string>();
			for (const entry of breakup) {
				const id = entry["@ondc/org/item_id"];
				const type = entry["@ondc/org/title_type"];
				if (id && type && fulfillmentIds.includes(id)) {
				matchedFulfillmentIds.add(id);
				}
			}

			for (const id of fulfillmentIds) {
				if (!matchedFulfillmentIds.has(id)) {
				return { valid: false, message: `Breakup must include a pricing entry for fulfillment ${id}` };
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