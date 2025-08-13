import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_update_buyer_instructions } from "./generator";

export class MockOnUpdateBuyerInstructions extends MockAction {
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
		return "on_update";
	}
	get description(): string {
		return "Mock action for on_update_buyer_instructions response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_update_buyer_instructions(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };

			const order = targetPayload.message?.order;
			if (!order) return { valid: false, message: "message.order is required" };
			if (!order.id) return { valid: false, message: "order.id is required" };
			if (!order.state) return { valid: false, message: "order.state is required" };

			if (!order.provider?.id) return { valid: false, message: "order.provider.id is required" };
			if (!Array.isArray(order.provider.locations) || order.provider.locations.length === 0 || !order.provider.locations[0].id) {
				return { valid: false, message: "At least one provider location with id is required" };
			}

			if (!Array.isArray(order.items) || order.items.length === 0) {
				return { valid: false, message: "order.items must be a non-empty array" };
			}
			for (const item of order.items) {
				if (!item.id || !item.fulfillment_id || !item.quantity?.count) {
				return { valid: false, message: "Each item must have id, fulfillment_id, and quantity.count" };
				}
			}

			if (!order.billing || !order.billing.address || !order.billing.phone || !order.billing.name || !order.billing.email) {
				return { valid: false, message: "Complete billing info with address, phone, name, and email is required" };
			}

			if (!order.quote?.price?.value || !order.quote?.price?.currency) {
				return { valid: false, message: "order.quote.price with currency and value is required" };
			}

			const fulfillment = order.fulfillments?.find((f: { type: string; }) => f.type === "Delivery");
			if (!fulfillment) return { valid: false, message: "A 'Delivery' type fulfillment is required" };

			if (!fulfillment.id) return { valid: false, message: "fulfillment.id is required" };

			const instructions = fulfillment?.end?.instructions;
			if (!instructions?.long_desc) {
				return { valid: false, message: "fulfillment.end.instructions.long_desc is required" };
			}

			if (!instructions.additional_desc?.content_type) {
				return { valid: false, message: "instructions.additional_desc.content_type is required" };
			}

			return { valid: true };	
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		if (!sessionData.transaction_id) {
			return { valid: false, message: "transaction_id is required" };
		}
		if (!sessionData.order_id) {
			return { valid: false, message: "order_id is required" };
		}
		if (!sessionData.provider || typeof sessionData.provider !== 'object') {
			return { valid: false, message: "provider object is required" };
		}
		if (!sessionData.billing || typeof sessionData.billing !== 'object') {
			return { valid: false, message: "billing object is required" };
		}
		if (!sessionData.payment || typeof sessionData.payment !== 'object') {
			return { valid: false, message: "payment object is required" };
		}
		if (!sessionData.order_created_at) {
			return { valid: false, message: "order_created_at is required" };
		}
		if (!sessionData.items || !Array.isArray(sessionData.items)) {
			return { valid: false, message: "items array is required" };
		}
		if (!sessionData.fulfillments || !Array.isArray(sessionData.fulfillments)) {
			return { valid: false, message: "fulfillments array is required" };
		}
		if (!sessionData.quote || typeof sessionData.quote !== 'object') {
			return { valid: false, message: "quote object is required" };
		}
		if (sessionData.update_fulfillments && !Array.isArray(sessionData.update_fulfillments)) {
			return { valid: false, message: "update fulfillments must be an array if provided" };
		}
		return { valid: true };
	}
}