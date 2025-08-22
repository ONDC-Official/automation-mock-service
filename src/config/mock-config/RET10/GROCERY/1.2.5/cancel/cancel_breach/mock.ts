import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { cancel_breach_generator } from "./generator";

export class MockCancelBreach extends MockAction {
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
		return "cancel";
	}
	get description(): string {
		return "Mock action for cancel breach scenario.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return cancel_breach_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };

		const context = targetPayload.context;
		if (!context || context.action !== "cancel") {
		  return { valid: false, message: "context.action must be 'cancel'" };
		}
	  
		const message = targetPayload.message;
		if (!message) return { valid: false, message: "message is required" };
	  
		if (!message.order_id) {
		  return { valid: false, message: "message.order_id is required" };
		}
	  
		if (!message.cancellation_reason_id) {
		  return { valid: false, message: "message.cancellation_reason_id is required" };
		}
	  
		const descriptor = message.descriptor;
		if (!descriptor) {
		  return { valid: false, message: "message.descriptor is required" };
		}
	  
		if (!["fulfillment", "order"].includes(descriptor.name)) {
		  return { valid: false, message: "descriptor.name must be 'fulfillment' or 'order'" };
		}
	  
		if (!descriptor.short_desc) {
		  return { valid: false, message: "descriptor.short_desc (fulfillment_id or *) is required" };
		}
	  
		const tags = descriptor.tags || [];
		const paramsTag = tags.find((tag: any) => tag.code === "params");
		if (!paramsTag) {
		  return { valid: false, message: "descriptor.tags must include a tag with code 'params'" };
		}
	  
		const paramList = paramsTag.list || [];
		const breachEntry = paramList.find((p: any) => p.code === "breach");
		const ttlEntry = paramList.find((p: any) => p.code === "ttl_response");
	  
		if (!breachEntry || breachEntry.value !== "yes") {
		  return { valid: false, message: "'breach' must be set to 'yes' for breach cancel" };
		}
	  
		if (!ttlEntry || typeof ttlEntry.value !== "string" || !/^P(T.*)?$/.test(ttlEntry.value)) {
		  return { valid: false, message: "ttl_response must be a valid ISO 8601 duration (e.g., PT1H)" };
		}
	  
		return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		if (!sessionData.transaction_id) {
			return { valid: false, message: "Transaction ID is required for cancel action" };
		}

		if (!sessionData.order_id) {
			return { valid: false, message: "Order ID is required for cancel action" };
		}

		return { valid: true };
	}
}