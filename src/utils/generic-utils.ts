export function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function updateProviderTime(payload: any) {
	const now = new Date();
	const twoDaysLater = new Date(
		now.getTime() + 2 * 24 * 60 * 60 * 1000
	);

	const provider = payload?.message?.order?.provider;

	if (provider?.time?.range) {
		provider.time.range.start = now.toISOString();
		provider.time.range.end = twoDaysLater.toISOString();
	}

	return payload;
}