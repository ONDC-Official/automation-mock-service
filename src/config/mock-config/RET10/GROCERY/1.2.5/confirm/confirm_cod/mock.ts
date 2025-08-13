import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { confirm_cod_generator } from "./generator";

export class MockConfirmCod extends MockAction {
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
		return "Mock action for confirming cash on delivery order in a grocery.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return confirm_cod_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };
		const order = targetPayload.message?.order;
		if (!order) return { valid: false, message: "message.order is required" };
	  
		const payment = order.payment;
		if (!payment || payment.type !== "ON-FULFILLMENT" || payment.collected_by !== "BPP") {
		  return { valid: false, message: "Order must be a COD order with payment.type='ON-FULFILLMENT' and collected_by='BPP'" };
		}
	  
		const tags = order.tags || [];
		const bnpClaimTag = tags.find((tag: any) => tag.code === "bap_terms");
		if (!bnpClaimTag || !Array.isArray(bnpClaimTag.list)) {
		  return { valid: false, message: "bap_terms tag is required in order.tags for COD" };
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