import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { update_buyer_instructions } from "./generator";
 
export class MockUpdateBuyerInstructions extends MockAction {
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
		return "update";
	}
	get description(): string {
		return "Mock action for updating buyer instructions.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return update_buyer_instructions(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };
	
		if (targetPayload.message?.update_target !== "fulfillment") {
		  return { valid: false, message: "update_target must be 'fulfillment'" };
		}
	  
		const order = targetPayload.message?.order;
		if (!order || !order.id) {
		  return { valid: false, message: "order and order.id are required" };
		}
	  
		const fulfillment = order.fulfillments?.[0];
		if (!fulfillment || fulfillment.type !== "Delivery") {
		  return { valid: false, message: "fulfillment.type must be 'Delivery'" };
		}
	  
		if (!fulfillment.id) {
		  return { valid: false, message: "fulfillment.id is required" };
		}
	  
		const instructions = fulfillment.end?.instructions;
		if (!instructions || !instructions.long_desc) {
		  return { valid: false, message: "fulfillment.end.instructions.long_desc is required" };
		}
	  
		const additional = instructions.additional_desc;
		if (!additional || !additional.content_type || !additional.url) {
		  return { valid: false, message: "instructions.additional_desc must have both 'content_type' and 'url'" };
		}
	  
		return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {


		if (!sessionData.fulfillments || sessionData.fulfillments.length === 0) {
			return { valid: false, message: "Fulfillments are required for update action" };
		}

		return { valid: true };
	}
}