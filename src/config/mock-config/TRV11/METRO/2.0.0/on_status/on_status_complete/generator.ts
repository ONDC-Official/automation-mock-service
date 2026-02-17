import { SessionData } from "../../../../session-types";


export async function onStatusCompleteGenerator(existingPayload: any,sessionData: SessionData){
    if (sessionData.updated_payments.length > 0) {
		existingPayload.message.order.payments = sessionData.updated_payments;
	  }
	
	if (sessionData.items.length > 0) {
	existingPayload.message.order.items = sessionData.items;
	}

	if (sessionData.fulfillments.length > 0) {
	// Deep clone to avoid mutating sessionData
	const fulfillments = JSON.parse(JSON.stringify(sessionData.fulfillments));
	
	// Add state and update authorization for journey completion
	fulfillments.forEach((fulfillment: any) => {
		// Enhancement 1: Add fulfillment state for journey completed
		fulfillment.state = {
			descriptor: {
				code: "COMPLETED"
			}
		};
		
		// Enhancement 2: Update authorization status to CLAIMED in START stop
		if (fulfillment.stops && fulfillment.stops.length > 0) {
			const startStop = fulfillment.stops.find((s: any) => s.type === "START");
			if (startStop && startStop.authorization) {
				startStop.authorization.status = "CLAIMED";
			}
		}
	});
	
	existingPayload.message.order.fulfillments = fulfillments;
	}
	if (sessionData.order_id) {
	existingPayload.message.order.id = sessionData.order_id;
	}
	if(sessionData.quote != null){
	existingPayload.message.order.quote = sessionData.quote
	}
    existingPayload.message.order.status = "COMPLETED"
	const now = new Date().toISOString();
    existingPayload.message.order.created_at = sessionData.created_at
    existingPayload.message.order.updated_at = now
    return existingPayload;
}