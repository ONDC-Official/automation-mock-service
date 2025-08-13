import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_search_inc_close } from "./generator";

export class MockOnSearchIncClose extends MockAction {
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
		return "on_search";
	}
	get description(): string {
		return "Mock action for on_search_inc_close response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_search_inc_close(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };
	
		const { message } = targetPayload;
	
		const providers = message?.catalog?.["bpp/providers"];
		if (!Array.isArray(providers) || providers.length === 0) {
			return { valid: false, message: "At least one provider is required" };
		}
	
		for (const provider of providers) {
			const providerId = provider?.id || "";
			const locations = provider?.locations;
			if (!Array.isArray(locations) || locations.length === 0) {
				return { valid: false, message: `Locations are required for provider ${providerId}` };
			}
	
			for (const location of locations) {
				const locationId = location?.id || "";
				const time = location?.time;
	
				if (!time) {
					return { valid: false, message: `time object is required for location ${locationId}` };
				}
	
				if (time.label !== "close") {
					return { valid: false, message: `time.label must be 'close' for location ${locationId}` };
				}
	
				const range = time.range;
				if (!range) {
					return { valid: false, message: `Range object is required for location ${locationId}` };
				}
	
				if (!range.start) {
					return { valid: false, message: `range.start is required for location ${locationId}` };
				}
			}
		}

		return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// on_search has no specific requirements
		return { valid: true };
	}
}