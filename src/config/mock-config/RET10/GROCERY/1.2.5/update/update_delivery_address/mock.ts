import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { update_delivery_address } from "./generator";

export class MockUpdateDeliveryAddress extends MockAction {
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
		return "update";
	}
	get description(): string {
		return "Mock action for updating delivery address.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return update_delivery_address(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };
	  
		const order = targetPayload.message?.order;
		if (!order?.id) return { valid: false, message: "order.id is required" };
		const fulfillments = order.fulfillments;
		if (!Array.isArray(fulfillments) || fulfillments.length === 0) {
		  return { valid: false, message: "order.fulfillments must be a non-empty array" };
		}
	  
		const deliveryFulfillment = fulfillments.find(f => f.type === "Delivery");
		if (!deliveryFulfillment) return { valid: false, message: "A fulfillment of type 'Delivery' is required" };
		if (!deliveryFulfillment.id) return { valid: false, message: "fulfillment.id is required" };
	  
		const end = deliveryFulfillment.end;
		if (!end?.location?.gps) return { valid: false, message: "fulfillment.end.location.gps is required" };
	  
		const address = end.location.address;
		const requiredAddressFields = ["name", "building", "locality", "city", "state", "country", "area_code"];
		for (const field of requiredAddressFields) {
		  if (!address?.[field]) return { valid: false, message: `fulfillment.end.location.address.${field} is required` };
		}
	  
		if (!end.person?.name) return { valid: false, message: "fulfillment.end.person.name is required" };
		if (!end.contact?.phone) return { valid: false, message: "fulfillment.end.contact.phone is required" };
	  
		return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// Update requires transaction_id, order_id, and fulfillments
		if (!sessionData.transaction_id) {
			return { valid: false, message: "Transaction ID is required for update action" };
		}

		if (!sessionData.order_id) {
			return { valid: false, message: "Order ID is required for update action" };
		}

		if (!sessionData.fulfillments || sessionData.fulfillments.length === 0) {
			return { valid: false, message: "Fulfillments are required for update action" };
		}

		return { valid: true };
	}
}