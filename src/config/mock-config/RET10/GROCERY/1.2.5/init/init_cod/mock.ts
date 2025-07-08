import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { init_cod_generator } from "./generator";

export class MockInitCod extends MockAction {
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
		return "init_cod";
	}
	get description(): string {
		return "Mock action for initializing order in a grocery with cash on delivery.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return init_cod_generator(existingPayload, sessionData);
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