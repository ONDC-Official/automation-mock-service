import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { init_multi_fulfillment_generator } from "./generator";

export class MockInitMultiFulfillment extends MockAction {
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
		return "init";
	}
	get description(): string {
		return "Mock action for initializing order in a grocery with multiple fulfillments.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return init_multi_fulfillment_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
			const order = targetPayload.message?.order;
			if (!order) return { valid: false, message: "Message.order is required" };
		const items = order.items || [];
			const fulfillments = order.fulfillments

			if (fulfillments.length < 2) {
				return { valid: false, message: "At least two fulfillments are required for multiple fulfillment flow" };
			}	
			return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// Init requires transaction_id, selected_items, on_select_fulfillments, provider
		if (!sessionData.transaction_id) {
			return { valid: false, message: "Transaction ID is required for init action" };
		}

		if (!sessionData.selected_items || !Array.isArray(sessionData.selected_items)) {
			return { valid: false, message: "Selected items array is required for init action" };
		}

		if (!sessionData.on_select_fulfillments || !Array.isArray(sessionData.on_select_fulfillments)) {
			return { valid: false, message: "On select fulfillments array is required for init action" };
		}

		if (!sessionData.provider || typeof sessionData.provider !== 'object') {
			return { valid: false, message: "Provider object is required for init action" };
		}

		if (!sessionData.selected_offers || !Array.isArray(sessionData.selected_offers)) {
			return { valid: false, message: "Selected offers array is required for init action" };
		}

		return { valid: true };
	}
}