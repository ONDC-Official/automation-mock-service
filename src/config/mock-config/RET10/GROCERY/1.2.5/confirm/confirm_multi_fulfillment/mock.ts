import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { confirm_multi_fulfillment_generator } from "./generator";

export class MockConfirmMultiFulfillment extends MockAction {
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
		return "Mock action for confirming order with multiple fulfillments in a grocery.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return confirm_multi_fulfillment_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };
	  
		const order = targetPayload.message?.order;
		if (!order) return { valid: false, message: "message.order is required" };
	  
		const items = order.items || [];
		const fulfillments = order.fulfillments || [];
	  
		if (fulfillments.length < 2) {
		  return { valid: false, message: "At least two fulfillments are required for multiple fulfillment validation" };
		}
	  
		const fulfillmentIds = fulfillments.map((f: any) => f.id);
	  
		for (const item of items) {
		  if (!item.fulfillment_id || !fulfillmentIds.includes(item.fulfillment_id)) {
			return { valid: false, message: `Item with id '${item.id}' has invalid or missing fulfillment_id` };
		  }
		}
	  
		return { valid: true };
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

		return { valid: true };
	}
}