export async function selectGenerator(existingPayload: any, sessionData: any) {
	// Filter for Pass item (I3) from sessionData items
	const passItem = sessionData?.items?.find((item: any) => item.id === 'I3');
	
	if (passItem) {
		existingPayload.message.order.items = [
			{ id: passItem.id, quantity: { selected: { count: 1 } } }
		];
	} else {
		// Fallback to static I3 if not in sessionData
		existingPayload.message.order.items = [
			{ id: 'I3', quantity: { selected: { count: 1 } } }
		];
	}
	
	existingPayload.message.order.fulfillments = [{ id: 'F2' }];
	
	if (sessionData.provider_id) {
		existingPayload.message.order.provider.id = sessionData.provider_id;
	}
	
	return existingPayload;
}
