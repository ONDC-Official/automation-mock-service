import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_confirm_cod_generator } from "./generator";

export class MockOnConfirmCod extends MockAction {
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
		return "on_confirm";
	}
	get description(): string {
		return "Mock action for on_confirm_cod response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_confirm_cod_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };

		const order = targetPayload.message?.order;
		if (!order) return { valid: false, message: "message.order is required" };
	  
		const payment = order.payment;
		if (!payment || payment.type !== "ON-FULFILLMENT" || payment.collected_by !== "BPP") {
		  return { valid: false, message: "This validation applies only to COD orders (type 'ON-FULFILLMENT' and collected_by 'BPP')" };
		}
	  
		const tags = order.tags || [];
		const bnpClaimTag = tags.find((tag: any) => tag.code === "bap_terms");
	  
		if (!bnpClaimTag) {
		  return { valid: false, message: "'bap_terms' tag must be present for COD orders" };
		}  
		return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// on_confirm requires transaction_id, billing, items, provider, quote, and bpp_terms
		if (!sessionData.transaction_id) {
			return { valid: false, message: "transaction_id is required" };
		}
		if (!sessionData.billing) {
			return { valid: false, message: "billing is required" };
		}
		if (!sessionData.items || !Array.isArray(sessionData.items)) {
			return { valid: false, message: "items array is required" };
		}
		if (!sessionData.provider) {
			return { valid: false, message: "provider is required" };
		}
		if (!sessionData.quote) {
			return { valid: false, message: "quote is required" };
		}
		if (!sessionData.order_created_at) {
			return { valid: false, message: "order_created_at is required" };
		}
		if (!sessionData.order_id) {
			return { valid: false, message: "order_id is required" };
		}
		if (!sessionData.payment) {
			return { valid: false, message: "payment is required" };
		}
		if (!sessionData.on_select_fulfillments || !Array.isArray(sessionData.on_select_fulfillments)) {
			return { valid: false, message: "on_select_fulfillments array is required" };
		}
		if (!sessionData.fulfillments || !Array.isArray(sessionData.fulfillments)) {
			return { valid: false, message: "fulfillments array is required" };
		}
		return { valid: true };
	}
}