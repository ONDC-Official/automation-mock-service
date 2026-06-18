import { updateProviderTime } from "../../../../../../../utils/generic-utils";
import { SessionData } from "../../../../session-types";


export async function onStatusActiveGenerator(existingPayload: any,sessionData: SessionData){
    // Detect Ticket Expiry flow
    const isExpiryFlow = sessionData.flowId === "TICKET_EXPIRY_CANCELLATION_FLOW";
    
    if (sessionData.updated_payments.length > 0) {
		existingPayload.message.order.payments = sessionData.updated_payments;
	  }
	
	if (sessionData.items.length > 0) {
	existingPayload.message.order.items = sessionData.items;
	}

	if (sessionData.fulfillments.length > 0) {
		const fulfillments = JSON.parse(JSON.stringify(sessionData.fulfillments));
		
		if (isExpiryFlow) {
			// For expiry flow, set TICKET_EXPIRED state and EXPIRED authorization
			fulfillments.forEach((fulfillment: any) => {
				fulfillment.state = {
					descriptor: { code: "TICKET_EXPIRED" }
				};
				if (fulfillment.stops?.length > 0) {
					const startStop = fulfillment.stops.find((s: any) => s.type === "START");
					if (startStop?.authorization) {
						startStop.authorization.status = "EXPIRED";
					}
				}
			});
		}
		
		existingPayload.message.order.fulfillments = fulfillments;
	}
	if (sessionData.order_id) {
	existingPayload.message.order.id = sessionData.order_id;
	}
	if(sessionData.quote != null){
	existingPayload.message.order.quote = sessionData.quote
	}
	if (sessionData.billing) {
    existingPayload.message.order.billing = sessionData.billing;
    }
    existingPayload.message.order.status = "ACTIVE"
	const now = new Date().toISOString();
    existingPayload.message.order.created_at = sessionData.created_at
    existingPayload.message.order.updated_at = now
	existingPayload = updateProviderTime(existingPayload)
    return existingPayload;
}