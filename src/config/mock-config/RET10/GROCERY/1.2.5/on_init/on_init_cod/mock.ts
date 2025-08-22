import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_init_cod_generator } from "./generator";

export class MockOnInitCod extends MockAction {
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
		return "Mock action for on_init_cod response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_init_cod_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };

		const order = targetPayload.message?.order;
		if (!order) return { valid: false, message: "Message.order is required" };
	  
		const payment = order.payment;
		if (!payment) return { valid: false, message: "Order.payment is required" };
	  
		if (payment.type !== "ON-FULFILLMENT") {
		  return { valid: false, message: "Payment.type must be 'ON-FULFILLMENT'" };
		}
	  
		if (payment.collected_by !== "BPP") {
		  return { valid: false, message: "Payment.collected_by must be 'BPP'" };
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
		if (!sessionData.billing) {
			return { valid: false, message: "billing is required" };
		}
		if (!sessionData.provider) {
			return { valid: false, message: "provider is required" };
		}
		if (!sessionData.quote) {
			return { valid: false, message: "quote is required" };
		}
		return { valid: true };
	}
}