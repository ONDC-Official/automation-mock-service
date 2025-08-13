import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_init_multi_fulfillment_generator } from "./generator";

export class MockOnInitMultiFulfillment extends MockAction {
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
		return "Mock action for on_init_multi_fulfillment response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_init_multi_fulfillment_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };

		const order = 	targetPayload.message?.order;
		if (!order) return { valid: false, message: "Message.order is required" };
		const fulfillments = order.fulfillments;
		if (!Array.isArray(fulfillments) || fulfillments.length === 0) {
			return { valid: false, message: "Order.fulfillments must be a non-empty array" };
		}

		const items = order.items;
		if (!Array.isArray(items) || items.length === 0) {
			return { valid: false, message: "Order.items must be a non-empty array" };
		}

		const selectedFulfillmentIds = new Set(items.map(i => i.fulfillment_id));
		const allFulfillmentIds = new Set(fulfillments.map(f => f.id));
		for (const fid of selectedFulfillmentIds) {
			if (!allFulfillmentIds.has(fid)) {
			return { valid: false, message: `Fulfillment id ${fid} referenced in items is missing in fulfillments` };
			}
		}
        if (fulfillments.length < 2) {
			return { valid: false, message: `Fulfillments must be array with greater than two length` };
			}

		const quote = order.quote;
		if (!quote) return { valid: false, message: "Order.quote is required" };

		const breakup = quote.breakup;
		if (!Array.isArray(breakup) || breakup.length === 0) {
			return { valid: false, message: "Quote.breakup must be a non-empty array" };
		}
		return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// on_init requires transaction_id, items, billing, provider, and quote
		if (!sessionData.transaction_id) {
			return { valid: false, message: "transaction_id is required" };
		}
		if (!sessionData.items || !Array.isArray(sessionData.items)) {
			return { valid: false, message: "items array is required" };
		}
		if (!sessionData.protocol_session_id) {
			return { valid: false, message: "protocol_session_id is required" };
		}
		return { valid: true };
	}
}