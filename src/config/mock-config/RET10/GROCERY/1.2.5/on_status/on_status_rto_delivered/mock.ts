import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_status_rto_delivereddisposed_generator } from "./generator";

export class MockOnStatusRtoDelivered extends MockAction {
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
		return "Mock action for on_status_rto_delivered response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_status_rto_delivereddisposed_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };

		const order = targetPayload?.message?.order;
	  
		if (!order) return { valid: false, message: "Message.order is required" };
		if (!order.id) return { valid: false, message: "Message.order.id is required" };
		if (!order.state) return { valid: false, message: "Message.order.state is required" };
		if (order.state !== "Cancelled") {
		  return { valid: false, message: "Order.state must be 'Cancelled'" };
		}
	  
		const fulfillments = order.fulfillments || [];
		if (!Array.isArray(fulfillments) || fulfillments.length === 0) {
		  return { valid: false, message: "At least one fulfillment is required" };
		}
	  
		const rtoFulfillment = fulfillments.find(f => f?.state?.descriptor?.code === "RTO-Delivered");
		if (!rtoFulfillment) {
		  return { valid: false, message: "At least one fulfillment.state.descriptor.code must be 'RTO-Delivered'" };
		}
	  
		const startTime = rtoFulfillment?.start?.time?.timestamp;
		const endTime = rtoFulfillment?.end?.time?.timestamp;
	  
		if (!startTime) {
		  return { valid: false, message: "fulfillment.start.time.timestamp is required for RTO-Delivered" };
		}
		if (!endTime) {
		  return { valid: false, message: "fulfillment.end.time.timestamp is required for RTO-Delivered" };
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