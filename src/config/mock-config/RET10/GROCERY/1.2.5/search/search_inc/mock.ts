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
	 			const context = targetPayload?.context;
		 		const message = targetPayload?.message;

				if (!context || !message) return { valid: false, message: "context and message are required" };

				if (context.city !== "*") {
					return { valid: false, message: "context.city must be '*'" };
				}

				const intent = message.intent;
				if (!intent || !intent.provider || !intent.provider.id) {
					return { valid: false, message: "message.intent.provider.id is required for incremental catalog" };
				}

				return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		return { valid: true };
	}
}
