import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_update_delivery_address } from "./generator";

export class MockOnUpdateDeliveryAddress extends MockAction {
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
		return "Mock action for on_update_delivery_address response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_update_delivery_address(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };
	  
		const order = targetPayload.message?.order;
		if (!order?.id) return { valid: false, message: "order.id is required" };
		if (!Array.isArray(order.fulfillments) || order.fulfillments.length === 0) {
		  return { valid: false, message: "order.fulfillments must be a non-empty array" };
		}
	  
		const fulfillment = order.fulfillments.find((f: { type: string; }) => f.type === "Delivery");
		if (!fulfillment) return { valid: false, message: "Delivery type fulfillment is required" };
	  
		if (!fulfillment.id) return { valid: false, message: "fulfillment.id is required" };
		const end = fulfillment.end;
		if (!end?.location?.gps) return { valid: false, message: "fulfillment.end.location.gps is required" };
	  
		const address = end.location.address;
		const requiredAddressFields = ["name", "building", "locality", "city", "state", "country", "area_code"];
		for (const field of requiredAddressFields) {
		  if (!address?.[field]) return { valid: false, message: `fulfillment.end.location.address.${field} is required` };
		}
	  
		if (!end.contact?.phone) return { valid: false, message: "fulfillment.end.contact.phone is required" };
		if (!end.person?.name) return { valid: false, message: "fulfillment.end.person.name is required" };
	  
		const instructions = end.instructions;
		if (!instructions?.long_desc) return { valid: false, message: "fulfillment.end.instructions.long_desc is required" };
		if (!instructions?.additional_desc?.content_type) {
		  return { valid: false, message: "fulfillment.end.instructions.additional_desc.content_type is required" };
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