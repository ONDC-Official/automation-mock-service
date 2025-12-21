export function getUpdatedBilling(savedBilling: any, initialize = false) {
	if (initialize) {
		const newIso = new Date(new Date().getTime() - 5 * 1000).toISOString();
		savedBilling.created_at = newIso;
		savedBilling.updated_at = newIso;
	}
	return savedBilling;
}
