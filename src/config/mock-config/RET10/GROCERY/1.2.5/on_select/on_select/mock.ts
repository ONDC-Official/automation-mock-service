import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_select_generator } from "./generator";

export class MockOnSelect extends MockAction {
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
		return "on_select";
	}
	get description(): string {
		return "Mock action for on_select response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_select_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
			if (!targetPayload) {
			return { valid: false, message: "Payload is required", code: "ERR_PAYLOAD_MISSING" };
		  }
		
		  const { message } = targetPayload;
		
		  if (!message || !message.order) {
			return {
			  valid: false,
			  message: "message.order is required",
			  code: "ERR_ORDER_MISSING"
			};
		  }
		
		  const order = message.order;
		
		  if (!order.provider?.id) {
			return {
			  valid: false,
			  message: "order.provider.id is required",
			  code: "ERR_PROVIDER_ID_MISSING"
			};
		  }
		
		  if (!Array.isArray(order.provider.locations) || order.provider.locations.length === 0) {
			return {
			  valid: false,
			  message: "order.provider.locations must be a non-empty array",
			  code: "ERR_PROVIDER_LOCATIONS_MISSING"
			};
		  }
		
		  if (!Array.isArray(order.items) || order.items.length === 0) {
			return {
			  valid: false,
			  message: "order.items must be a non-empty array",
			  code: "ERR_ITEMS_MISSING"
			};
		  }
		
		  for (const item of order.items) {
			if (!item.id || !item.fulfillment_id) {
			  return {
				valid: false,
				message: "Each item must have id and fulfillment_id",
				code: "ERR_ITEM_STRUCTURE"
			  };
			}
		  }
		
		  if (!Array.isArray(order.fulfillments) || order.fulfillments.length === 0) {
			return {
			  valid: false,
			  message: "order.fulfillments must be a non-empty array",
			  code: "ERR_FULFILLMENTS_MISSING"
			};
		  }
		
		  for (const fulfillment of order.fulfillments) {
			if (!fulfillment.id || !fulfillment.type || !fulfillment["@ondc/org/category"]) {
			  return {
				valid: false,
				message: "Each fulfillment must have id, type, and @ondc/org/category",
				code: "ERR_FULFILLMENT_STRUCTURE"
			  };
			}
		
			if (!fulfillment.state?.descriptor?.code) {
			  return {
				valid: false,
				message: "fulfillment.state.descriptor.code is required",
				code: "ERR_FULFILLMENT_STATE_MISSING"
			  };
			}
		  }
		
		  if (!order.quote?.price?.currency || !order.quote.price.value) {
			return {
			  valid: false,
			  message: "quote.price must contain currency and value",
			  code: "ERR_QUOTE_PRICE_MISSING"
			};
		  }
		
		  if (!Array.isArray(order.quote.breakup) || order.quote.breakup.length === 0) {
			return {
			  valid: false,
			  message: "quote.breakup must be a non-empty array",
			  code: "ERR_QUOTE_BREAKUP_MISSING"
			};
		  }
		
		  for (const breakup of order.quote.breakup) {
			if (!breakup["@ondc/org/item_id"] || !breakup["@ondc/org/title_type"] || !breakup.price?.currency || !breakup.price.value) {
			  return {
				valid: false,
				message: "Each breakup entry must have item_id, title_type, price.currency, and price.value",
				code: "ERR_QUOTE_BREAKUP_STRUCTURE"
			  };
			}
		  }
		
		  return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		if (!sessionData.transaction_id) {
			return { valid: false, message: "transaction_id is required" };
		}
		if (!sessionData.selected_items || !Array.isArray(sessionData.selected_items)) {
			return { valid: false, message: "selected_items array is required" };
		}
		return { valid: true };
	}
}