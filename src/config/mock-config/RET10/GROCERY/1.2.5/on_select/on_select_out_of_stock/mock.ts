import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_select_out_of_stock_generator } from "./generator";

export class MockOnSelectOutOfStock extends MockAction {
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
		return "Mock action for on_select_out_of_stock response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_select_out_of_stock_generator(existingPayload, sessionData);
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
	  
		for (const f of order.fulfillments) {
		  if (!f.id) return { valid: false, message: "Each fulfillment.id is required" };
		  if (!f.type) return { valid: false, message: `Fulfillment ${f.id}: type is required` };
		  if (!f["@ondc/org/TAT"]) return { valid: false, message: `Fulfillment ${f.id}: @ondc/org/TAT is required` };
		  if (!f.state?.descriptor?.code ) {
			return { valid: false, message: `Fulfillment ${f.id}: state.descriptor.code must be 'Out-of-stock'` };
		  }
		}
	  
		const breakup = order.quote?.breakup;
		if (!Array.isArray(breakup) || breakup.length === 0) {
		  return { valid: false, message: "Order.quote.breakup must be a non-empty array" };
		}
	  
		let foundZeroQty = false;
		for (const b of breakup) {
			const itemQty = b["@ondc/org/item_quantity"];
			const titleType = b["@ondc/org/title_type"];
			if (titleType === "item") {
			if (!itemQty || typeof itemQty.count !== "number") {
				return { valid: false, message: `Invalid or missing item_quantity for item ${b["@ondc/org/item_id"]}` };
			}
			if (itemQty.count === 0) {
				foundZeroQty = true;
			}
			}
		}

		if (!foundZeroQty) {
			return { valid: false, message: "At least one item must have count 0 in breakup for 'Out-of-stock'" };
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
		if (sessionData.out_of_stock_item_ids && !Array.isArray(sessionData.out_of_stock_item_ids)) {
			return { valid: false, message: "out_of_stock_item_ids must be an array if provided" };
		}
		return { valid: true };
	}
}