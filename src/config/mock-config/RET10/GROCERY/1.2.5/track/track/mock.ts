import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { track_generator } from "./generator";

export class MockTrack extends MockAction {
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
		return "track";
	}
	get description(): string {
		return "Mock action for tracking an order.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return track_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		// Track action validation
		if (!targetPayload) {
			return { valid: false, message: "Payload is required" };
		}

		// Check if message exists
		if (!targetPayload.message) {
			return { valid: false, message: "Message is required" };
		}

		// Check if tracking object exists
		if (!targetPayload.message.tracking) {
			return { valid: false, message: "Message.tracking is required" };
		}

		return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// Track requires transaction_id and order_id
		if (!sessionData.transaction_id) {
			return { valid: false, message: "Transaction ID is required for track action" };
		}

		if (!sessionData.order_id) {
			return { valid: false, message: "Order ID is required for track action" };
		}

		return { valid: true };
	}
}