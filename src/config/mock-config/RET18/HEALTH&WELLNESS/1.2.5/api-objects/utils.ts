export const isoDurToSec = (duration: string) => {
	const durRE =
		/P((\d+)Y)?((\d+)M)?((\d+)W)?((\d+)D)?T?((\d+)H)?((\d+)M)?((\d+)S)?/;

	const splitTime = durRE.exec(duration);
	if (!splitTime) {
		return 0;
	}

	const years = Number(splitTime?.[2]) || 0;
	const months = Number(splitTime?.[4]) || 0;
	const weeks = Number(splitTime?.[6]) || 0;
	const days = Number(splitTime?.[8]) || 0;
	const hours = Number(splitTime?.[10]) || 0;
	const minutes = Number(splitTime?.[12]) || 0;
	const seconds = Number(splitTime?.[14]) || 0;

	const result =
		years * 31536000 +
		months * 2628288 +
		weeks * 604800 +
		days * 86400 +
		hours * 3600 +
		minutes * 60 +
		seconds;

	return result;
};

export function getRandomItem(items: string[]): string | undefined {
	if (items.length === 0) {
		return undefined;
	}
	const randomIndex = Math.floor(Math.random() * items.length);
	return items[randomIndex];
}

export function updateTimestamps(obj: any) {
    const currentTimestamp = new Date().toISOString();
    
    function recursiveUpdate(current: any) {
        if (typeof current !== 'object' || current === null) {
            return;
        }
        
        for (const key in current) {
            if (key === 'timestamp' && typeof current[key] === 'string') {
                current[key] = currentTimestamp;
            } else if (typeof current[key] === 'object') {
                recursiveUpdate(current[key]);
            }
        }
    }
    
    recursiveUpdate(obj);
    return obj;
}
