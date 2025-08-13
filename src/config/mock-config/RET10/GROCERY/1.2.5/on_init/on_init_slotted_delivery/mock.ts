import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_init_slotted_delivery_generator } from "./generator";

export class MockOnInitSlottedDelivery extends MockAction {
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
		return "Mock action for on_init_slotted_delivery response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_init_slotted_delivery_generator(existingPayload, sessionData);
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

		const quote = order.quote;
		if (!quote) return { valid: false, message: "Order.quote is required" };

		const breakup = quote.breakup;
		if (!Array.isArray(breakup) || breakup.length === 0) {
			return { valid: false, message: "Quote.breakup must be a non-empty array" };
		}

			
		for (const f of fulfillments) {
			if (!f.id) return { valid: false, message: "Each fulfillment must have an id" };
			if (!f.type) return { valid: false, message: `Fulfillment ${f.id} must include type` };

			if (f.type === "Delivery" && f.end.time) {
			const range = f.end?.time?.range;
			if (!range?.start || !range?.end) {
				return { valid: false, message: `Delivery fulfillment '${f.id}' must have end.time.range.start and end.time.range.end` };
			}
			} else if (f.type === "Self-Pickup" && f.start.time) {
			const range = f.start?.time?.range;
			if (!range?.start || !range?.end) {
				return { valid: false, message: `Self-Pickup fulfillment '${f.id}' must have start.time.range.start and start.time.range.end` };
			}
			}else{
				return { valid: false, message: `Fulfillments are either be 'Self-Pickup' or be 'Delivery'` };

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