import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_cancel_rto_generator } from "./generator";

export class MockOnCancelRto extends MockAction {
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
		return "on_cancel";
	}
	get description(): string {
		return "Mock action for on_cancel_rto response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_cancel_rto_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };

			const order = targetPayload.message?.order;
			if (!order || !order.id) {
				return { valid: false, message: "Order and Order.id are required" };
			}

			const rtoFulfillments = order.fulfillments?.filter((f: any) => f.type === "RTO") || [];
			if (rtoFulfillments.length === 0) {
				return { valid: false, message: "At least one RTO fulfillment is required" };
			}

			for (const rto of rtoFulfillments) {
					const id=rto.id

				const stateCode = rto.state?.descriptor?.code;
				const isTerminal = ["RTO-Delivered", "RTO-Disposed", "Completed", "Cancelled"];

				if (isTerminal.includes(stateCode)) {
					if (!rto.end?.time?.timestamp) {
						return { valid: false, message: `End time.timestamp required for RTO fulfillment ${id} in state ${stateCode}` };
					}
					if (!rto.end?.location) {
					return { valid: false, message: `End location required for RTO fulfillment ${id}` };
					}
				}


				const quoteTags = rto.tags?.filter((t: any) => t.code === "quote_trail") || [];
				if (quoteTags.length === 0) {
				return { valid: false, message: `quote_trail is required in RTO fulfillment ${id}` };
				}

				for (const tag of quoteTags) {
				for (const entry of tag.list || []) {
					if (entry.code === "value") {
					const numVal = parseFloat(entry.value);
					if (isNaN(numVal)) {
						return { valid: false, message: `Invalid numeric value '${entry.value}' in quote_trail of ${id}` };
					}
					}
				}
				}
			}

			const rtoItem = order.items?.find((i: any) => i.fulfillment_id?.includes("rto"));
			if (!rtoItem) {
				return { valid: false, message: "At least one item must refer to an RTO fulfillment" };
			}

			if (rtoItem.quantity?.count <= 0) {
				return { valid: false, message: `Item ${rtoItem.id} in RTO must have quantity > 0` };
			}

			return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		if (!sessionData.transaction_id) {
			return { valid: false, message: "transaction_id is required" };
		}
		if (!sessionData.items || !Array.isArray(sessionData.items)) {
			return { valid: false, message: "items array is required" };
		}
		if (!sessionData.provider || typeof sessionData.provider !== 'object') {
			return { valid: false, message: "provider object is required" };
		}
		if (!sessionData.billing || typeof sessionData.billing !== 'object') {
			return { valid: false, message: "billing object is required" };
		}
		if (!sessionData.quote || typeof sessionData.quote !== 'object') {
			return { valid: false, message: "quote object is required" };
		}
		if (!sessionData.fulfillments || !Array.isArray(sessionData.fulfillments)) {
			return { valid: false, message: "fulfillments array is required" };
		}
		if (!sessionData.payment || typeof sessionData.payment !== 'object') {
			return { valid: false, message: "payment object is required" };
		}
		if (!sessionData.order_id) {
			return { valid: false, message: "order_id is required" };
		}
		if (!sessionData.order_created_at) {
			return { valid: false, message: "order_created_at is required" };
		}
		return { valid: true };
	}
}