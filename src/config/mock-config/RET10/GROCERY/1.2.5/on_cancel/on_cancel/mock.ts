import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_cancel_generator } from "./generator";

export class MockOnCancel extends MockAction {
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
		return "on_cancel";
	}
	get description(): string {
		return "Mock action for on_cancel response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_cancel_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
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