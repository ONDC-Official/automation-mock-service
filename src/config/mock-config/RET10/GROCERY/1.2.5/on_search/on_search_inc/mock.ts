import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_search_inc_generator } from "./generator";

export class MockOnSearchInc extends MockAction {
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
		return "Mock action for on_search_inc response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_search_inc_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload?.message?.catalog?.["bpp/providers"]) {
			return { valid: false, message: "catalog.bpp/providers array is required" };
		  }
		
		  for (const provider of targetPayload.message.catalog["bpp/providers"]) {
			if (!Array.isArray(provider.items) || provider.items.length === 0) {
			  return { valid: false, message: `Provider ${provider.id} must have at least one item` };
			}
		
			if (!Array.isArray(provider.offers)) {
			  continue;
			}
		
			for (const offer of provider?.offers) {
			  if (!offer.id) {
				return { valid: false, message: "Each offer must have an id" };
			  }
		
			  if (!offer.descriptor?.code || offer.descriptor.code !== "discount") {
				return { valid: false, message: `Offer ${offer.id} must have descriptor.code='discount'` };
			  }
		
			  if (!Array.isArray(offer.item_ids) || offer.item_ids.length === 0) {
				return { valid: false, message: `Offer ${offer.id} must include at least one item_id` };
			  }
		
			  if (!offer.time?.range?.start || !offer.time?.range?.end) {
				return { valid: false, message: `Offer ${offer.id} must include a valid time range` };
			  }
		
			  const hasQualifier = offer.tags?.some((tag: { code: string; }) => tag.code === "qualifier");
			  const hasBenefit = offer.tags?.some((tag: { code: string; }) => tag.code === "benefit");
		
			  if (!hasQualifier || !hasBenefit) {
				return { valid: false, message: `Offer ${offer.id} must include both 'qualifier' and 'benefit' tags` };
			  }
		
			  for (const tag of offer.tags) {
				if (tag.code === "benefit") {
				  const valueType = tag.list.find((i: { code: string; }) => i.code === "value_type")?.value;
				  const value = tag.list.find((i: { code: string; }) => i.code === "value")?.value;
		
				  if (!valueType || !["percent", "amount"].includes(valueType)) {
					return { valid: false, message: `Offer ${offer.id} benefit.value_type must be 'percent' or 'amount'` };
				  }
		
				  if (!value || isNaN(parseFloat(value))) {
					return { valid: false, message: `Offer ${offer.id} benefit.value must be a number` };
				  }
				}
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