import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { update_partial_cancel_settlement_generator } from "./generator";

export class MockUpdateSettlementTrail extends MockAction {
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
		return "update";
	}
	get description(): string {
		return "Mock action for updating settlement trail.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return update_partial_cancel_settlement_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
            const message = targetPayload?.message;

            if ( !message) {
              return { valid: false, message: "message is required" };
            }

            if (message.update_target !== "payment") {
              return { valid: false, message: "message.update_target must be 'payment'" };
            }

            const order = message.order;
            if (!order || !order.id) {
              return { valid: false, message: "message.order.id is required" };
            }

            if (!order.fulfillments || !Array.isArray(order.fulfillments) || order.fulfillments.length === 0) {
              return { valid: false, message: "message.order.fulfillments must contain at least one fulfillment" };
            }

            for (const fulfillment of order.fulfillments) {
              if (!fulfillment.id || !fulfillment.type) {
                return { valid: false, message: "Each fulfillment must include id and type" };
              }
            }

            const settlementDetails = order?.payment?.["@ondc/org/settlement_details"];
            if (!settlementDetails || !Array.isArray(settlementDetails) || settlementDetails.length === 0) {
              return { valid: false, message: "@ondc/org/settlement_details must be a non-empty array" };
            }

              const requiredFields = [
                "settlement_counterparty",
                "settlement_phase",
                "settlement_type",
                "settlement_amount",
                "settlement_timestamp"
              ];

            for (const detail of settlementDetails) {
              for (const field of requiredFields) {
                if (!detail[field]) {
                  return { valid: false, message: `Missing ${field} in settlement_details` };
                }
              }
            } 

            return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// Update requires transaction_id, order_id, and fulfillments
		if (!sessionData.transaction_id) {
			return { valid: false, message: "Transaction ID is required for update action" };
		}

		if (!sessionData.order_id) {
			return { valid: false, message: "Order ID is required for update action" };
		}

		if (!sessionData.fulfillments || sessionData.fulfillments.length === 0) {
			return { valid: false, message: "Fulfillments are required for update action" };
		}

		return { valid: true };
	}
}