import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_search_generator } from "./generator";

export class MockOnSearch extends MockAction {
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
		return "Mock action for on_search response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_search_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) {
			return { valid: false, message: "Payload is required", code: "ERR_PAYLOAD_MISSING" };
		  }
		
		  const { message } = targetPayload;
		
		  if (!message || !message.catalog) {
			return { valid: false, message: "Message.catalog is required", code: "ERR_CATALOG_MISSING" };
		  }
		
		  const catalog = message.catalog;
		
		  const bppDescriptor = catalog["bpp/descriptor"];
		  if (!bppDescriptor || typeof bppDescriptor.name !== "string") {
			return {
			  valid: false,
			  message: "'catalog.bpp/descriptor.name' is required",
			  code: "ERR_BPP_DESCRIPTOR_NAME_MISSING"
			};
		  }
		
		  const providers = catalog["bpp/providers"];
		  if (!Array.isArray(providers) || providers.length === 0) {
			return {
			  valid: false,
			  message: "catalog.bpp/providers must be a non-empty array",
			  code: "ERR_PROVIDERS_MISSING"
			};
		  }
		
		  for (const provider of providers) {
			if (!provider.id) {
			  return {
				valid: false,
				message: "Each provider must have an id",
				code: "ERR_PROVIDER_ID_MISSING"
			  };
			}
		
			if (!provider.descriptor?.name) {
			  return {
				valid: false,
				message: `Provider '${provider.id}' must have a descriptor.name`,
				code: "ERR_PROVIDER_DESCRIPTOR"
			  };
			}
		
			if (provider.fulfillments) {
			  for (const fulfillment of provider.fulfillments) {
				if (!fulfillment.id || !fulfillment.type) {
				  return {
					valid: false,
					message: `Fulfillment must have id and type in provider '${provider.id}'`,
					code: "ERR_FULFILLMENT_STRUCTURE"
				  };
				}
		
				if (!fulfillment.contact?.phone || !fulfillment.contact?.email) {
				  return {
					valid: false,
					message: `Fulfillment contact info missing in provider '${provider.id}'`,
					code: "ERR_FULFILLMENT_CONTACT"
				  };
				}
			  }
			}
		
			if (provider.locations) {
			  for (const location of provider.locations) {
				if (!location.id || !location.gps || !location.address) {
				  return {
					valid: false,
					message: `Location must have id, gps, and address in provider '${provider.id}'`,
					code: "ERR_LOCATION_STRUCTURE"
				  };
				}
			  }
			}
		
			if (provider.items) {
			  for (const item of provider.items) {
				if (!item.id || !item.descriptor?.name || !item.price?.value) {
				  return {
					valid: false,
					message: `Item must have id, descriptor.name, and price.value in provider '${provider.id}'`,
					code: "ERR_ITEM_STRUCTURE"
				  };
				}
		
				if (typeof item["@ondc/org/returnable"] === "undefined" ||
					typeof item["@ondc/org/available_on_cod"] !== "boolean") {
				  return {
					valid: false,
					message: `Item '${item.id}' missing key ONDC flags`,
					code: "ERR_ITEM_ONDC_FLAGS"
				  };
				}
			  }
			}
		  }
		
		  return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		return { valid: true };
	}
}