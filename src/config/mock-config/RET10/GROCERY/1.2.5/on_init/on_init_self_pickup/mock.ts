import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_init_self_pickup_generator } from "./generator";

export class MockOnInitSelfPickup extends MockAction {
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
		return "on_init";
	}
	get description(): string {
		return "Mock action for on_init_self_pickup response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_init_self_pickup_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };

		const order = targetPayload.message?.order;
		if (!order) return { valid: false, message: "Message.order is required" };
	  
		const items = order.items;
		if (!Array.isArray(items) || items.length === 0) {
		  return { valid: false, message: "Order.items must be a non-empty array" };
		}
	  
		const fulfillments = order.fulfillments;
		if (!Array.isArray(fulfillments) || fulfillments.length === 0) {
		  return { valid: false, message: "Order.fulfillments must be a non-empty array" };
		}
		const fulfillmentIds = new Set(fulfillments.map(f => f.id));
		for (const item of items) {
		  if (!fulfillmentIds.has(item.fulfillment_id)) {
			return { valid: false, message: `Item.fulfillment_id '${item.fulfillment_id}' not found in fulfillments` };
		  }
		}
	  
		const quote = order.quote;
		if (!quote) return { valid: false, message: "Order.quote is required" };
	  
		const breakup = quote.breakup;
		if (!Array.isArray(breakup) || breakup.length === 0) {
		  return { valid: false, message: "Quote.breakup must be a non-empty array" };
		}
	  
		
		const selfPickup = fulfillments.find(f => f.type === "Self-Pickup");
		if (!selfPickup) return { valid: false, message: "At least one Self-Pickup fulfillment is required" };
	  
		const selectedFulfillmentIds = new Set(items.map(i => i.fulfillment_id));
		for (const b of breakup) {
		  const itemId = b["@ondc/org/item_id"];
		  const titleType = b["@ondc/org/title_type"];
		  const price = b.price?.value;
	  

	  
		 if (
			titleType === "delivery" &&
			selectedFulfillmentIds.has(itemId) &&
			fulfillments.find(f => f.id === itemId)?.type === "Self-Pickup"
		  ) {
			if (price !== "00.00") {
			  return {
				valid: false,
				message: `Delivery charge for Self-Pickup fulfillment '${itemId}' must be 0.00`
			  };
			}
		  }
		}
	  
		return { valid: true };
	  
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// on_init requires transaction_id, items, billing, provider, and quote
		if (!sessionData.transaction_id) {
			return { valid: false, message: "transaction_id is required" };
		}
		if (!sessionData.items || !Array.isArray(sessionData.items)) {
			return { valid: false, message: "items array is required" };
		}
		if (!sessionData.billing) {
			return { valid: false, message: "billing is required" };
		}
		if (!sessionData.provider) {
			return { valid: false, message: "provider is required" };
		}
		if (!sessionData.quote) {
			return { valid: false, message: "quote is required" };
		}
		if (!sessionData.fulfillments || !Array.isArray(sessionData.fulfillments)) {
			return { valid: false, message: "fulfillments array is required" };
		}
		if (!sessionData.on_select_fulfillments || !Array.isArray(sessionData.on_select_fulfillments)) {
			return { valid: false, message: "on_select_fulfillments array is required" };
		}
		return { valid: true };
	}
}