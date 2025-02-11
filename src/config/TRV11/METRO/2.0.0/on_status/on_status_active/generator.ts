<<<<<<<< HEAD:src/config/TRV11/METRO/on_status/on_status_active/generator.ts
import { SessionData } from "../../../session-types";
========
import { SessionData } from "../../../../session-types";

>>>>>>>> feature/rework:src/config/TRV11/METRO/2.0.0/on_status/on_status_active/generator.ts

export async function onStatusActiveGenerator(existingPayload: any,sessionData: SessionData){
    if (sessionData.updated_payments.length > 0) {
		existingPayload.message.order.payments = sessionData.updated_payments;
	  }
	
	if (sessionData.items.length > 0) {
	existingPayload.message.order.items = sessionData.items;
	}

	if (sessionData.fulfillments.length > 0) {
	existingPayload.message.order.fulfillments = sessionData.fulfillments;
	}
	if (sessionData.order_id) {
	existingPayload.message.order_id = sessionData.order_id;
	}
	if(sessionData.quote != null){
	existingPayload.message.order.quote = sessionData.quote
	}
    existingPayload.message.order.status = "ACTIVE"
    return existingPayload;
}