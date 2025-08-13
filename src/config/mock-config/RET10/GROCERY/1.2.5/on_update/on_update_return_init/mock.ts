import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_update_interim_reverse_qc_generator } from "./generator";

export class MockOnUpdateReturnInit extends MockAction {
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
		return "Mock action for on_update_return_init response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_update_interim_reverse_qc_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
			if (!targetPayload) return { valid: false, message: "Payload is required" };

				const order = targetPayload.message?.order;
				if (!order || !order.id) {
					return { valid: false, message: "Order and order.id are required" };
				}

				const fulfillments = order.fulfillments;
				if (!Array.isArray(fulfillments) || fulfillments.length === 0) {
					return { valid: false, message: "At least one fulfillment is required" };
				}

				const returnFulfillment = fulfillments.find((f: any) => f.type === "Return");
				if (!returnFulfillment) {
					return { valid: false, message: "Return fulfillment type is required" };
				}

				if (!returnFulfillment.id) {
					return { valid: false, message: "Return fulfillment must have an id" };
				}

				const tags = returnFulfillment.tags || [];
				const returnTag = tags.find((t: any) => t.code === "return_request");
				if (!returnTag) {
					return { valid: false, message: "Return fulfillment must contain tag with code 'return_request'" };
				}

				const requiredCodes = [
					"id", "item_id", "item_quantity", "reason_id",
					"reason_desc", "ttl_approval", "ttl_reverseqc"
				];

				for (const code of requiredCodes) {
					const found = returnTag.list?.some((entry: any) => entry.code === code && entry.value?.toString().trim() !== "");
					if (!found) {
					return { valid: false, message: `Missing or empty '${code}' in return_request tag` };
					}
				}

				const quantity = returnTag.list.find((e: any) => e.code === "item_quantity")?.value;
				if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
					return { valid: false, message: "item_quantity in return_request must be a positive number" };
				}

				return { valid: true };
	}
	
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// on_update requires transaction_id and order
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
			return { valid: false, message: "update_fulfillments must be an array if provided" };
		}
		return { valid: true };
	}
}