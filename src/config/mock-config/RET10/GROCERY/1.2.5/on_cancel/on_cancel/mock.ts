import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_cancel_generator } from "./generator";

export class MockOnCancel extends MockAction {
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
		return "on_cancel";
	}
	get description(): string {
		return "Mock action for on_cancel response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_cancel_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };

		const order = targetPayload.message?.order;
		if (!order || !order.id) {
		  return { valid: false, message: "Order and Order.id are required" };
		}
	  
		if (!order.cancellation?.reason?.id || !order.cancellation?.cancelled_by) {
		  return { valid: false, message: "Cancellation.reason.id and cancelled_by are required" };
		}
	  
		const cancelFulfillments = order.fulfillments?.filter((f: any) => f.type === "Cancel") || [];
		for (const f of cancelFulfillments) {
		  const quoteTrail = f.tags?.find((tag: any) => tag.code === "quote_trail");
		  if (!quoteTrail) {
			return { valid: false, message: `Fulfillment ${f.id} must include a 'quote_trail' tag` };
		  }
		}
	  
		return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		if (!sessionData.transaction_id) {
			return { valid: false, message: "transaction_id is required" };
		}
		if (!sessionData.cancellation_reason_id) {
			return { valid: false, message: "cancellation_reason_id is required" };
		}
		if (!sessionData.items || !Array.isArray(sessionData.items)) {
			return { valid: false, message: "items array is required" };
		}
		if (!sessionData.provider || typeof sessionData.provider !== 'object') {
			return { valid: false, message: "provider object is required" };
		}
		if (!sessionData.billing || typeof sessionData.billing !== 'object') {
			return { valid: false, message: "billing object is required" };
		}
		if (!sessionData.quote || typeof sessionData.quote !== 'object') {
			return { valid: false, message: "quote object is required" };
		}
		if (!sessionData.fulfillments || !Array.isArray(sessionData.fulfillments)) {
			return { valid: false, message: "fulfillments array is required" };
		}
		if (!sessionData.payment || typeof sessionData.payment !== 'object') {
			return { valid: false, message: "payment object is required" };
		}
		if (!sessionData.order_id) {
			return { valid: false, message: "order_id is required" };
		}
		if (!sessionData.order_created_at) {
			return { valid: false, message: "order_created_at is required" };
		}
		return { valid: true };
	}
}