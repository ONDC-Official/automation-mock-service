import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_update_part_cancel_generator } from "./generator";

export class MockOnUpdatePartCancel extends MockAction {
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
		return "on_update";
	}
	get description(): string {
		return "Mock action for on_update_part_cancel response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_update_part_cancel_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		const message = targetPayload?.message;

		if (!message) return { valid: false, message: "message is required" };

		const order = message.order;
		if (!order?.id) return { valid: false, message: "order.id is required" };
	  
		const items = order?.items || [];
		const fulfillments = order?.fulfillments || [];
	  
		if (!items.length) return { valid: false, message: "order.items is empty" };
		if (!fulfillments.length) return { valid: false, message: "order.fulfillments is empty" };
	  
		const cancelFulfillment = fulfillments.find((f: { type: string; }) => f.type === "Cancel");
		if (!cancelFulfillment) return { valid: false, message: "Cancel fulfillment missing" };
	  
		const cancelTags = cancelFulfillment.tags?.find((t: { code: string; }) => t.code === "cancel_request");
		if (!cancelTags) return { valid: false, message: "cancel_request tag missing in Cancel fulfillment" };
	  
		const quoteTrail = cancelFulfillment.tags?.find((t: { code: string; }) => t.code === "quote_trail");
		if (!quoteTrail) return { valid: false, message: "quote_trail tag missing in Cancel fulfillment" };
	  
		const cancelledItemId = quoteTrail.list?.find((x: { code: string; }) => x.code === "id")?.value;
		const cancelValue = quoteTrail.list?.find((x: { code: string; }) => x.code === "value")?.value;
	  
		if (!cancelledItemId || !cancelValue) {
		  return { valid: false, message: "quote_trail must include item id and value" };
		}
	  
		const itemCancelSplit = items.filter((x: { id: any; }) => x.id === cancelledItemId);
		const hasZeroQty = itemCancelSplit.some((x: { quantity: { count: number; }; }) => x.quantity?.count === 0);
		const hasCancelId = itemCancelSplit.some((x: { fulfillment_id: any; }) => x.fulfillment_id === cancelFulfillment.id);
	  
		if (!hasZeroQty || !hasCancelId) {
		  return { valid: false, message: `Item '${cancelledItemId}' must show both 0 quantity and mapped to cancel fulfillment` };
		}
	  
		const quoteBreakup = order?.quote?.breakup;
		const quoteBreakupItem = quoteBreakup?.find((x: { [x: string]: any; }) => x["@ondc/org/item_id"] === cancelledItemId);
		if (!quoteBreakupItem || quoteBreakupItem?.price?.value !== "0.00") {
		  return { valid: false, message: `Breakup for cancelled item '${cancelledItemId}' must have price 0.00` };
		}
	  
		if (!order.quote?.price?.value) {
		  return { valid: false, message: "order.quote.price.value is required" };
		}
	  
		if (!order.billing?.address?.city || !order.billing?.phone) {
		  return { valid: false, message: "order.billing must include address and phone" };
		}
	  
		if (!order.payment?.params?.amount || !order.payment?.status) {
		  return { valid: false, message: "order.payment must include amount and status" };
		}
	  
		const hasSettlement = Array.isArray(order.payment?.["@ondc/org/settlement_details"]) &&
		  order.payment["@ondc/org/settlement_details"].length > 0;
	  
		if (!hasSettlement) {
		  return { valid: false, message: "@ondc/org/settlement_details is missing or invalid" };
		}
	  
		return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		if (!sessionData.transaction_id) {
			return { valid: false, message: "transaction_id is required" };
		}
		if (!sessionData.order_id) {
			return { valid: false, message: "order_id is required" };
		}
		if (!sessionData.provider || typeof sessionData.provider !== 'object') {
			return { valid: false, message: "provider object is required" };
		}
		if (!sessionData.billing || typeof sessionData.billing !== 'object') {
			return { valid: false, message: "billing object is required" };
		}
		if (!sessionData.payment || typeof sessionData.payment !== 'object') {
			return { valid: false, message: "payment object is required" };
		}
		if (!sessionData.order_created_at) {
			return { valid: false, message: "order_created_at is required" };
		}
		if (!sessionData.items || !Array.isArray(sessionData.items)) {
			return { valid: false, message: "items array is required" };
		}
		if (!sessionData.fulfillments || !Array.isArray(sessionData.fulfillments)) {
			return { valid: false, message: "fulfillments array is required" };
		}
		if (!sessionData.quote || typeof sessionData.quote !== 'object') {
			return { valid: false, message: "quote object is required" };
		}
		if (sessionData.selected_offers && !Array.isArray(sessionData.selected_offers)) {
			return { valid: false, message: "selected_offers must be an array if provided" };
		}
		return { valid: true };
	}
}