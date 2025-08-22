import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_init_generator } from "./generator";

export class MockOnInit extends MockAction {
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
		return "Mock action for on_init response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_init_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required", code: "ERR_PAYLOAD_MISSING" }

		const { message } = targetPayload
	  
		if (!message || !message.order) {
		  return { valid: false, message: "message.order is required", code: "ERR_ORDER_MISSING" }
		}
	  
		const order = message.order
	  
		if (!order.provider?.id) {
		  return { valid: false, message: "order.provider.id is required", code: "ERR_PROVIDER_ID_MISSING" }
		}
	  
		if (!Array.isArray(order.provider.locations) || order.provider.locations.length === 0) {
		  return { valid: false, message: "order.provider.locations must be a non-empty array", code: "ERR_PROVIDER_LOCATIONS" }
		}
	  
		if (!Array.isArray(order.items) || order.items.length === 0) {
		  return { valid: false, message: "order.items must be a non-empty array", code: "ERR_ITEMS_MISSING" }
		}
	  
		for (const item of order.items) {
		  if (!item.id || !item.fulfillment_id || !item.quantity?.count) {
			return { valid: false, message: "Each item must have id, fulfillment_id, and quantity.count", code: "ERR_ITEM_STRUCTURE" }
		  }
		}
	  
		if (!order.billing) {
		  return { valid: false, message: "order.billing is required", code: "ERR_BILLING_MISSING" }
		}
	  
		const billing = order.billing
		const requiredBillingFields = ["name", "phone", "created_at", "updated_at"]
		for (const field of requiredBillingFields) {
		  if (!billing[field]) {
			return { valid: false, message: `billing.${field} is required`, code: `ERR_BILLING_${field.toUpperCase()}_MISSING` }
		  }
		}
	  
		const billingAddress = billing.address
		const addressFields = ["name", "building", "locality", "city", "state", "country", "area_code"]
		if (!billingAddress) {
		  return { valid: false, message: "billing.address is required", code: "ERR_BILLING_ADDRESS_MISSING" }
		}
		for (const field of addressFields) {
		  if (!billingAddress[field]) {
			return { valid: false, message: `billing.address.${field} is required`, code: `ERR_BILLING_ADDRESS_${field.toUpperCase()}_MISSING` }
		  }
		}
	  
		if (!Array.isArray(order.fulfillments) || order.fulfillments.length === 0) {
		  return { valid: false, message: "order.fulfillments must be a non-empty array", code: "ERR_FULFILLMENTS_MISSING" }
		}
	  
		for (const fulfillment of order.fulfillments) {
		  if (!fulfillment.id || !fulfillment.type) {
			return { valid: false, message: "Each fulfillment must have id and type", code: "ERR_FULFILLMENT_STRUCTURE" }
		  }
		  const end = fulfillment.end
		  if (!end?.location?.gps || !end?.location?.address?.area_code || !end?.contact?.phone) {
			return { valid: false, message: "fulfillment.end.location.gps, address.area_code, and contact.phone are required", code: "ERR_FULFILLMENT_END_STRUCTURE" }
		  }
		}
	  
		if (!order.quote?.price?.currency || !order.quote?.price?.value) {
		  return { valid: false, message: "order.quote.price.currency and value are required", code: "ERR_QUOTE_PRICE_MISSING" }
		}
	  
		if (!Array.isArray(order.quote.breakup) || order.quote.breakup.length === 0) {
		  return { valid: false, message: "order.quote.breakup must be a non-empty array", code: "ERR_QUOTE_BREAKUP_MISSING" }
		}
	  
		if (!order.payment?.["@ondc/org/buyer_app_finder_fee_type"] || !order.payment?.["@ondc/org/buyer_app_finder_fee_amount"]) {
		  return { valid: false, message: "order.payment buyer_app_finder_fee_type and amount are required", code: "ERR_PAYMENT_BUYER_APP_FINDER_FEE_MISSING" }
		}
	  
		return { valid: true }
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
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
		return { valid: true };
	}
}