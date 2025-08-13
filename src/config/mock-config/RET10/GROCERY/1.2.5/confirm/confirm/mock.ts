import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { confirm_generator } from "./generator";

export class MockConfirm extends MockAction {
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
		return "confirm";
	}
	get description(): string {
		return "Mock action for confirming order in a grocery.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return confirm_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
	  
		const { message } = targetPayload
	  
		if (!message) return { valid: false, message: "Message is required" }
	  
		const { order } = message
		if (!order) return { valid: false, message: "Message.order is required" }
	  
		if (!order.id) return { valid: false, message: "Message.order.id is required" }
	  
		if (!order.state) return { valid: false, message: "Message.order.state is required" }
	  
		if (!order.quote) return { valid: false, message: "Message.order.quote is required" }
	  
		if (!order.payment) return { valid: false, message: "Message.order.payment is required" }
	  
		if (!order.provider?.id) return { valid: false, message: "Message.order.provider.id is required" }
	  
		if (!Array.isArray(order.items) || order.items.length === 0) {
		  return { valid: false, message: "Message.order.items must be a non-empty array" }
		}
	  
		if (!order.billing?.name || !order.billing.address?.area_code) {
		  return { valid: false, message: "Message.order.billing.name and address.area_code are required" }
		}
	  
		if (!Array.isArray(order.fulfillments) || order.fulfillments.length === 0) {
		  return { valid: false, message: "Message.order.fulfillments must be a non-empty array" }
		}
	  
		for (const fulfillment of order.fulfillments) {
		  if (!fulfillment.id || !fulfillment.type) {
			return { valid: false, message: "Each fulfillment must have id and type" }
		  }
		  if (
			!fulfillment.end?.location?.gps ||
			!fulfillment.end?.location?.address?.area_code ||
			!fulfillment.end?.contact?.phone
		  ) {
			return { valid: false, message: "Fulfillment must have end.location.gps, address.area_code and contact.phone" }
		  }
		}
	  
		if (!order.payment.status || !order.payment.params?.amount) {
		  return { valid: false, message: "Payment must include uri, status and params.amount" }
		}
	  
		return { valid: true }
	  }
	  
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		if (!sessionData.transaction_id) {
			return { valid: false, message: "Transaction ID is required for confirm action" };
		}

		if (!sessionData.quote) {
			return { valid: false, message: "Quote is required for confirm action" };
		}

		if (!sessionData.billing) {
			return { valid: false, message: "Billing is required for confirm action" };
		}

		if (!sessionData.items || !Array.isArray(sessionData.items)) {
			return { valid: false, message: "Items array is required for confirm action" };
		}

		if (!sessionData.provider) {
			return { valid: false, message: "Provider is required for confirm action" };
		}

		if (!sessionData.bpp_terms) {
			return { valid: false, message: "BPP terms are required for confirm action" };
		}

		return { valid: true };
	}
}