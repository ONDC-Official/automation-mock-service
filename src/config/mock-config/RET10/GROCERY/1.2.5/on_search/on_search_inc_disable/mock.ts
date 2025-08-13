import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_search_inc_disable_generator } from "./generator";

export class MockOnSearchIncDisable extends MockAction {
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
		return "Mock action for on_search_inc_disable response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_search_inc_disable_generator(existingPayload, sessionData);
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
			if (!providerId) {
				return { valid: false, message: "Provider id is required" };
			}
	
			if (provider.time) {
				if (provider.time.label !== "disable") {
					return { valid: false, message: `time.label must be 'disable' for provider ${providerId}` };
				}
			} else if (provider.locations) {
				if (!Array.isArray(provider.locations) || provider.locations.length === 0) {
					return { valid: false, message: `Locations are required for provider ${providerId}` };
				}
	
				for (const location of provider.locations) {
					const locationId = location?.id || "";
					if (!locationId) {
						return { valid: false, message: `Location id is required for provider ${providerId}` };
					}
					if (!location.time) {
						return { valid: false, message: `time object is required for location ${locationId}` };
					}
					if (location.time.label !== "disable") {
						return { valid: false, message: `time.label must be 'disable' for location ${locationId}` };
					}
					}
			} else {
				return { valid: false, message: `Either provider.time or provider.locations must be present for provider ${providerId}` };
			}
		}

		return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// on_search has no specific requirements
		return { valid: true };
	}
}