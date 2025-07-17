import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { search_inc_generator } from "./generator";

export class MockSearchInc extends MockAction {
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
		return "search";
	}
	get description(): string {
		return "Mock mock action for searching items in a grocery with incremental data.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return search_inc_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		// Search action validation
		if (!targetPayload) {
			return { valid: false, message: "Payload is required" };
		}

		// Check if context exists and has required fields
		if (!targetPayload.context) {
			return { valid: false, message: "Context is required" };
		}

		const { context } = targetPayload;
		
		if (!context.domain) {
			return { valid: false, message: "Context domain is required" };
		}
		
		if (!context.action) {
			return { valid: false, message: "Context action is required" };
		}
		
		if (!context.country) {
			return { valid: false, message: "Context country is required" };
		}
		
		if (!context.city) {
			return { valid: false, message: "Context city is required" };
		}

		return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// Search action has no specific session data requirements
		return { valid: true };
	}
}
