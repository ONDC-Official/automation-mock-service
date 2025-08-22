import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_init_buyer_delivery_generator } from "./generator";

export class MockOnInitBuyerDelivery extends MockAction {
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
		return "Mock action for on_init_buyer_delivery response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_init_buyer_delivery_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };

		const order = targetPayload.message?.order;
		if (!order) return { valid: false, message: "Message.order is required" };
	  
		const items = order.items || [];
		const fulfillments = order.fulfillments || [];
	  
		const fulfillmentMap: Record<string, any> = {};
		for (const f of fulfillments) {
		  fulfillmentMap[f.id] = f;
		}
	  
		for (const item of items) {
		  if (!item.id || !item.fulfillment_id) {
			return { valid: false, message: "Each item must have id and fulfillment_id" };
		  }
	  
		  if (item.tags) {
			const rtoTag = item.tags.find((t: any) => t.code === "rto_action");
			const rtoValue = rtoTag?.list?.find((l: any) => l.code === "return_to_origin")?.value;
			if (rtoValue === "yes") {
			  const fulfillment = fulfillmentMap[item.fulfillment_id];
			  const fulfillmentRtoTag = fulfillment?.tags?.find((t: any) => t.code === "rto_action");
			  const fulfillmentRtoValue = fulfillmentRtoTag?.list?.find((l: any) => l.code === "return_to_origin")?.value;
			  if (fulfillmentRtoValue !== "yes") {
				return {
				  valid: false,
				  message: `Fulfillment ${item.fulfillment_id} must contain rto_action.return_to_origin='yes'`
				};
			  }
			}
		  }
		}
	  
		for (const f of fulfillments) {
		  if (f.type !== "Buyer-Delivery") {
			return { valid: false, message: `Fulfillment ${f.id} must have type 'Buyer-Delivery'` };
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
		return { valid: true };
	}
}