import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_update_approved_generator } from "./generator";

export class MockOnUpdateReturnApproved extends MockAction {
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
		return "Mock action for on_update_return_approved response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_update_approved_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };
	  
		const order = targetPayload.message?.order;
		if (!order || !order.id) {
		  return { valid: false, message: "Order and order.id are required" };
		}
	  
		const fulfillments = order.fulfillments || [];
		const returnFulfillment = fulfillments.find((f: any) => f.type === "Return");
		if (!returnFulfillment) {
		  return { valid: false, message: "Return fulfillment is required" };
		}
	  
		const returnState = returnFulfillment.state?.descriptor?.code;
		if (returnState !== "Return_Approved") {
		  return { valid: false, message: "Return fulfillment must be in 'Return_Approved' state" };
		}
	  
		if (!returnFulfillment.start?.location || !returnFulfillment.start?.time?.range) {
		  return { valid: false, message: "Start location and time.range are required in return fulfillment" };
		}
	  
		if (!returnFulfillment.end?.location || !returnFulfillment.end?.time?.range) {
		  return { valid: false, message: "End location and time.range are required in return fulfillment" };
		}
	  
		const tags = returnFulfillment.tags || [];
		const returnTag = tags.find((t: any) => t.code === "return_request");
		if (!returnTag) {
		  return { valid: false, message: "return_request tag is required in return fulfillment" };
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
		return { valid: true };
	}
}