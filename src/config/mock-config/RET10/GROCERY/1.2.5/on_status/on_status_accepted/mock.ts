import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_status_accepted_generator } from "./generator";

export class MockOnStatusAccepted extends MockAction {
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
		return "on_status";
	}
	get description(): string {
		return "Mock action for on_status_accepted response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_status_accepted_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };

		const { message } = targetPayload;

		if (!message) return { valid: false, message: "Message is required" };
	  
		const { order } = message;
		if (!order) return { valid: false, message: "Message.order is required" };
	  
		if (!order.id) return { valid: false, message: "Message.order.id is required" };
		if (!order.state) return { valid: false, message: "Message.order.state is required" };
		if (order.state !== "Accepted") {
		  return { valid: false, message: `Invalid order.state: expected 'Accepted', got '${order.state}'` };
		}
	  
		if (!order.provider?.id) return { valid: false, message: "Message.order.provider.id is required" };
	  
		if (!Array.isArray(order.items) || order.items.length === 0) {
		  return { valid: false, message: "Message.order.items must be a non-empty array" };
		}
	  
		if (!order.billing?.name || !order.billing.address?.area_code) {
		  return { valid: false, message: "Message.order.billing.name and billing.address.area_code are required" };
		}
	  
		if (!Array.isArray(order.fulfillments) || order.fulfillments.length === 0) {
		  return { valid: false, message: "Message.order.fulfillments must be a non-empty array" };
		}
	  
		for (const fulfillment of order.fulfillments) {
		  if (!fulfillment.id || !fulfillment.type) {
			return { valid: false, message: "Each fulfillment must have id and type" };
		  }
	  
		  if (!fulfillment.state?.descriptor?.code) {
			return { valid: false, message: "Fulfillment.state.descriptor.code is required" };
		  }
	  
		  if (!fulfillment.start?.location?.gps || !fulfillment.start?.location?.address?.area_code) {
			return { valid: false, message: "Fulfillment.start.loc	ation.gps and address.area_code are required" };
		  }
	  
		  if (!fulfillment.end?.location?.gps || !fulfillment.end?.location?.address?.area_code) {
			return { valid: false, message: "Fulfillment.end.location.gps and address.area_code are required" };
		  }
	  
		  if (!fulfillment.start.contact?.phone) {
			return { valid: false, message: "Fulfillment.start.contact.phone is required" };
		  }
	  
		  if (!fulfillment.end.contact?.phone) {
			return { valid: false, message: "Fulfillment.end.contact.phone is required" };
		  }
	  }
	  
		if (!order.quote?.price?.currency || !order.quote?.price?.value) {
		  return { valid: false, message: "Message.order.quote.price.currency and value are required" };
		}
	  
		if (!Array.isArray(order.quote.breakup) || order.quote.breakup.length === 0) {
		  return { valid: false, message: "Message.order.quote.breakup must be a non-empty array" };
		}
	  
		if (!order.payment?.status || !order.payment?.params?.amount ) {
		  return { valid: false, message: "Message.order.payment must include uri, status and params.amount" };
		}
	  
		if (!Array.isArray(order.payment["@ondc/org/settlement_details"])) {
		  return { valid: false, message: "Message.order.payment.@ondc/org/settlement_details must be an array" };
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
		if (!sessionData.items || !Array.isArray(sessionData.items)) {
			return { valid: false, message: "items array is required" };
		}
		if (!sessionData.billing || typeof sessionData.billing !== 'object') {
			return { valid: false, message: "billing object is required" };
		}
		if (!sessionData.quote || typeof sessionData.quote !== 'object') {
			return { valid: false, message: "quote object is required" };
		}
		if (!sessionData.order_created_at) {
			return { valid: false, message: "order_created_at is required" };
		}
		if (!sessionData.payment || typeof sessionData.payment !== 'object') {
			return { valid: false, message: "payment object is required" };
		}
		if (!sessionData.fulfillments || !Array.isArray(sessionData.fulfillments)) {
			return { valid: false, message: "fulfillments array is required" };
		}
		if (!sessionData.on_select_fulfillments || !Array.isArray(sessionData.on_select_fulfillments)) {
			return { valid: false, message: "on_select_fulfillments array is required" };
		}
		if (!sessionData.on_status_fulfillments || !Array.isArray(sessionData.on_status_fulfillments)) {
			return { valid: false, message: "on_status_fulfillments array is required" };
		}
		return { valid: true };
	}
}