import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_status_order_delivered_cod_generator } from "./generator";

export class MockOnStatusOrderDeliveredCod extends MockAction {
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
		return "on_status";
	}
	get description(): string {
		return "Mock action for on_status_order_delivered_cod response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_status_order_delivered_cod_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
			const order = targetPayload?.message?.order;

			if (order.state !== "Completed") {
				return { valid: false, message: "order.state must be 'Completed'" };
			}

			const payment = order.payment;

			if (!payment) return { valid: false, message: "order.payment is required" };

			if (payment.type !== "ON-FULFILLMENT") {
				return { valid: false, message: "payment.type must be 'ON-FULFILLMENT'" };
			}

			if (payment.collected_by !== "BPP") {
				return { valid: false, message: "payment.collected_by must be 'BPP'" };
			}

			if (payment.status !== "PAID") {
				return { valid: false, message: "payment.status must be 'PAID'" };
			}

			const settlementDetails = payment["@ondc/org/settlement_details"];
			if (!Array.isArray(settlementDetails) || settlementDetails.length === 0) {
				return { valid: false, message: "@ondc/org/settlement_details is required and must be a non-empty array" };
			}

			const fulfillments = order.fulfillments;
			if (!Array.isArray(fulfillments) || fulfillments.length === 0) {
				return { valid: false, message: "order.fulfillments must be a non-empty array" };
			}

			const deliveryFulfillment = fulfillments.find(f =>
				["Delivery", "Buyer-Delivery"].includes(f.type) &&
				f?.state?.descriptor?.code === "Order-delivered"
			);

			if (!deliveryFulfillment) {
				return { valid: false, message: "No fulfillment with type Delivery/Buyer-Delivery and state 'Order-delivered'" };
			}

			if (!deliveryFulfillment?.end?.time?.timestamp) {
				return { valid: false, message: "Delivery fulfillment must include end.time.timestamp" };
			}

			return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// on_status requires transaction_id and order
		if (!sessionData.transaction_id) {
			return { valid: false, message: "transaction_id is required" };
		}
		if (!sessionData.order_id) {
			return { valid: false, message: "order_id is required" };
		}
		if (!sessionData.provider || typeof sessionData.provider !== 'object') {
			return { valid: false, message: "provider object is required" };
		}
		if (!sessionData.items || !Array.isArray(sessionData.items)) {
			return { valid: false, message: "items array is required" };
		}
		if (!sessionData.billing || typeof sessionData.billing !== 'object') {
			return { valid: false, message: "billing object is required" };
		}
		if (!sessionData.quote || typeof sessionData.quote !== 'object') {
			return { valid: false, message: "quote object is required" };
		}
		if (!sessionData.order_created_at) {
			return { valid: false, message: "order_created_at is required" };
		}
		if (!sessionData.payment || typeof sessionData.payment !== 'object') {
			return { valid: false, message: "payment object is required" };
		}
		if (!sessionData.fulfillments || !Array.isArray(sessionData.fulfillments)) {
			return { valid: false, message: "fulfillments array is required" };
		}
		if (!sessionData.on_select_fulfillments || !Array.isArray(sessionData.on_select_fulfillments)) {
			return { valid: false, message: "on_select_fulfillments array is required" };
		}
		if (!sessionData.on_status_fulfillments || !Array.isArray(sessionData.on_status_fulfillments)) {
			return { valid: false, message: "on_status_fulfillments array is required" };
		}
		return { valid: true };
	}
}