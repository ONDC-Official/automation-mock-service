import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_update_delivery_auth } from "./generator";

export class MockOnUpdateDeliveryAuth extends MockAction {
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
		return "Mock action for on_update_delivery_auth response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_update_delivery_auth(existingPayload, sessionData);
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
		if (fulfillment.state?.descriptor?.code !== "Order-picked-up") {
		  return { valid: false, message: "fulfillment.state.descriptor.code must be 'Order-picked-up'" };
		}
	  
		const start = fulfillment.start;
		if (!start?.location?.gps) return { valid: false, message: "fulfillment.start.location.gps is required" };
		if (!start?.contact?.phone) return { valid: false, message: "fulfillment.start.contact.phone is required" };
		if (!start?.contact?.email) return { valid: false, message: "fulfillment.start.contact.email is required" };
		if (!start?.time?.range?.start || !start?.time?.range?.end) {
		  return { valid: false, message: "fulfillment.start.time.range.start and end are required" };
		}
		if (!start?.time?.timestamp) return { valid: false, message: "fulfillment.start.time.timestamp is required" };
	  
		const end = fulfillment.end;
		if (!end?.location?.gps) return { valid: false, message: "fulfillment.end.location.gps is required" };
		const address = end?.location?.address;
		const requiredAddressFields = ["building", "city", "state", "country", "area_code", "locality", "name"];
		for (const field of requiredAddressFields) {
		  if (!address?.[field]) return { valid: false, message: `fulfillment.end.location.address.${field} is required` };
		}
		if (!end?.contact?.phone) return { valid: false, message: "fulfillment.end.contact.phone is required" };
		if (!end?.contact?.email) return { valid: false, message: "fulfillment.end.contact.email is required" };
		if (!end?.person?.name) return { valid: false, message: "fulfillment.end.person.name is required" };
		if (!end?.time?.range?.start || !end?.time?.range?.end) {
		  return { valid: false, message: "fulfillment.end.time.range.start and end are required" };
		}
	  
		const instructions = end?.instructions;
		if (!instructions?.code) return { valid: false, message: "fulfillment.end.instructions.code is required" };
		if (!instructions?.short_desc) return { valid: false, message: "fulfillment.end.instructions.short_desc is required" };
	  
		const agent = fulfillment.agent;
		if (!agent?.name) return { valid: false, message: "fulfillment.agent.name is required" };
		if (!agent?.phone) return { valid: false, message: "fulfillment.agent.phone is required" };
	  
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
		return { valid: true };
	}
}