import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { init_generator } from "./generator";

export class MockInit extends MockAction {
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
		return "init";
	}
	get description(): string {
		return "Mock action for initializing order in a grocery.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return init_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required", code: "ERR_PAYLOAD_MISSING" }

		const { message } = targetPayload
	  
		if (!message || !message.order) {
		  return {
			valid: false,
			message: "message.order is required",
			code: "ERR_ORDER_MISSING"
		  }
		}
	  
		const order = message.order
	  
		if (!order.provider?.id) {
		  return {
			valid: false,
			message: "order.provider.id is required",
			code: "ERR_PROVIDER_ID_MISSING"
		  }
		}
	  
		if (!Array.isArray(order.provider.locations) || order.provider.locations.length === 0) {
		  return {
			valid: false,
			message: "order.provider.locations must be a non-empty array",
			code: "ERR_PROVIDER_LOCATIONS_MISSING"
		  }
		}
	  
		if (!Array.isArray(order.items) || order.items.length === 0) {
		  return {
			valid: false,
			message: "order.items must be a non-empty array",
			code: "ERR_ITEMS_MISSING"
		  }
		}
	  
		for (const item of order.items) {
		  if (!item.id || !item.fulfillment_id || !item.quantity?.count) {
			return {
			  valid: false,
			  message: "Each item must have id, fulfillment_id, and quantity.count",
			  code: "ERR_ITEM_STRUCTURE"
			}
		  }
		}
	  
		if (!order.billing) {
		  return {
			valid: false,
			message: "order.billing is required",
			code: "ERR_BILLING_MISSING"
		  }
		}
	  
		const billing = order.billing
	  
		const requiredBillingFields = ["name", "phone", "created_at", "updated_at"]
	  
		for (const field of requiredBillingFields) {
		  if (!billing[field]) {
			return {
			  valid: false,
			  message: `billing.${field} is required`,
			  code: `ERR_BILLING_${field.toUpperCase()}_MISSING`
			}
		  }
		}
	  
		const addressFields = ["name", "building", "locality", "city", "state", "country", "area_code"]
		const billingAddress = billing.address
		if (!billingAddress) {
		  return {
			valid: false,
			message: "billing.address is required",
			code: "ERR_BILLING_ADDRESS_MISSING"
		  }
		}
	  
		for (const field of addressFields) {
		  if (!billingAddress[field]) {
			return {
			  valid: false,
			  message: `billing.address.${field} is required`,
			  code: `ERR_BILLING_ADDRESS_${field.toUpperCase()}_MISSING`
			}
		  }
		}
	  
		if (!Array.isArray(order.fulfillments) || order.fulfillments.length === 0) {
		  return {
			valid: false,
			message: "order.fulfillments must be a non-empty array",
			code: "ERR_FULFILLMENTS_MISSING"
		  }
		}
	  
		for (const fulfillment of order.fulfillments) {
		  if (!fulfillment.id || !fulfillment.type) {
			return {
			  valid: false,
			  message: "Each fulfillment must have id and type",
			  code: "ERR_FULFILLMENT_STRUCTURE"
			}
		  }
	  
		  const end = fulfillment.end
		  if (!end?.location?.gps) {
			return {
			  valid: false,
			  message: "fulfillment.end.location.gps is required",
			  code: "ERR_FULFILLMENT_LOCATION_GPS_MISSING"
			}
		  }
	  
		  const endAddress = end.location.address
		  for (const field of addressFields) {
			if (!endAddress?.[field]) {
			  return {
				valid: false,
				message: `fulfillment.end.location.address.${field} is required`,
				code: `ERR_FULFILLMENT_ADDRESS_${field.toUpperCase()}_MISSING`
			  }
			}
		  }
	  
		  if (!end.contact?.phone) {
			return {
			  valid: false,
			  message: "fulfillment.end.contact.phone is required",
			  code: "ERR_FULFILLMENT_CONTACT_PHONE_MISSING"
			}
		  }
		}
	  
		return { valid: true }
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		if (!sessionData.transaction_id) {
			return { valid: false, message: "Transaction ID is required for init action" };
		}

		if (!sessionData.selected_items || !Array.isArray(sessionData.selected_items)) {
			return { valid: false, message: "Selected items array is required for init action" };
		}

		if (!sessionData.on_select_fulfillments || !Array.isArray(sessionData.on_select_fulfillments)) {
			return { valid: false, message: "On select fulfillments array is required for init action" };
		}

		if (!sessionData.provider || typeof sessionData.provider !== 'object') {
			return { valid: false, message: "Provider object is required for init action" };
		}

		if (!sessionData.selected_offers || !Array.isArray(sessionData.selected_offers)) {
			return { valid: false, message: "Selected offers array is required for init action" };
		}

		return { valid: true };
	}
}