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
export class MockSearchInc implements MockAction {
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
		return "search_inc";
	}
	get description(): string {
		return "Mock mock action for searching items in a grocery with incremental data.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return search_inc_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any) {
		return {
			valid: true,
		};
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		return {
			valid: true,
		};
	}
}
