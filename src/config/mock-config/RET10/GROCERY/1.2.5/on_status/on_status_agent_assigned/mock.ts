import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_status_agent_assigned_generator } from "./generator";

export class MockOnStatusAgentAssigned extends MockAction {
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
		return "on_status";
	}
	get description(): string {
		return "Mock action for on_status_agent_assigned response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_status_agent_assigned_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) {
			return { valid: false, message: "Payload is required" };
		}
	
		const message = targetPayload.message;
		if (!message || !message.order) {
			return { valid: false, message: "Message.order is required" };
		}
	
		const { order } = message;
	
		if (!order.id) return { valid: false, message: "Message.order.id is required" };
		if (!order.state) return { valid: false, message: "Message.order.state is required" };
	
		if (!Array.isArray(order.fulfillments)) {
			return { valid: false, message: "Message.order.fulfillments must be an array" };
		}
	
		for (const fulfillment of order.fulfillments) {
				if(fulfillment.end || fulfillment.start){
					 if (fulfillment.tracking !== true) {
						  return { valid: false, message: "Fulfillment.tracking must be true when state is 'Agent-assigned'" };
					  }
					 const end = fulfillment.end;
					 const endLocation = end.location;
					 if (!endLocation?.gps) return { valid: false, message: "Fulfillment.end.location.gps is required" };
		 
					 const endAddress = endLocation.address;
					 const requiredEndAddressFields = ["name", "building", "locality", "city", "state", "country", "area_code"];
					 for (const field of requiredEndAddressFields) {
						 if (!endAddress?.[field]) {
							 return { valid: false, message: `Fulfillment.end.location.address.${field} is required` };
						 }
					 }

					 // if (!end.time?.timestamp) {
					 // 	return { valid: false, message: "Fulfillment.end.time.timestamp is required" };
					 // }
		 
					 if (!end.person?.name) {
						 return { valid: false, message: "Fulfillment.end.person.name is required" };
					 }
		 
					 if (!end.contact?.phone) {
						 return { valid: false, message: "Fulfillment.end.contact.phone is required" };
					 }
					 const agent = fulfillment.agent;
					 if (!agent?.name || !agent?.phone) {
						 return { valid: false, message: "Fulfillment.agent.name and phone are required" };
					 }
		 
					 const tags = fulfillment.tags || [];
		 
					 const routingTag = tags.find((t: any) => t.code === "routing");
					 if (routingTag && !Array.isArray(routingTag.list)) {
						 return { valid: false, message: "Fulfillment.tags[routing].list must be an array if provided" };
					 }
		 
					 const trackingTag = tags.find((t: any) => t.code === "tracking");
					 if (trackingTag) {
						 if (!Array.isArray(trackingTag.list)) {
							 return { valid: false, message: "Fulfillment.tags[tracking].list must be an array" };
						 }
		 
						 for (const tag of trackingTag.list) {
							 if (typeof tag.code !== "string" || typeof tag.value !== "string") {
								 return { valid: false, message: "Each tracking tag must have string code and value" };
							 }
						 }
					 }
				 }
			}
		
	
		return { valid: true };
	}
	
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		// on_status requires transaction_id and order
		if (!sessionData.transaction_id) {
			return { valid: false, message: "transaction_id is required" };
		}
		if (!sessionData.order_id) {
			return { valid: false, message: "order_id is required" };
		}
		if (!sessionData.provider || typeof sessionData.provider !== 'object') {
			return { valid: false, message: "provider object is required" };
		}
		if (!sessionData.items || !Array.isArray(sessionData.items)) {
			return { valid: false, message: "items array is required" };
		}
		if (!sessionData.billing || typeof sessionData.billing !== 'object') {
			return { valid: false, message: "billing object is required" };
		}
		if (!sessionData.quote || typeof sessionData.quote !== 'object') {
			return { valid: false, message: "quote object is required" };
		}
		if (!sessionData.order_created_at) {
			return { valid: false, message: "order_created_at is required" };
		}
		if (!sessionData.payment || typeof sessionData.payment !== 'object') {
			return { valid: false, message: "payment object is required" };
		}
		if (!sessionData.fulfillments || !Array.isArray(sessionData.fulfillments)) {
			return { valid: false, message: "fulfillments array is required" };
		}
		if (!sessionData.on_select_fulfillments || !Array.isArray(sessionData.on_select_fulfillments)) {
			return { valid: false, message: "on_select_fulfillments array is required" };
		}
		if (!sessionData.on_status_fulfillments || !Array.isArray(sessionData.on_status_fulfillments)) {
			return { valid: false, message: "on_status_fulfillments array is required" };
		}
		return { valid: true };
	}
}