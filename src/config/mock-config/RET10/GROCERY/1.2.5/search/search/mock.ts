import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { search_generator } from "./generator";
export class MockSearch extends MockAction {
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
		return "Mock action for searching items in a grocery.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return search_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) {
			return { valid: false, message: "Payload is required" };
		}

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
		if (!sessionData.user_inputs) {
			return { valid: false, message: "User Inputs is required for search action" };
		}

		return { valid: true };
	}
}
