export function isArrayKey<T>(key: keyof T, obj: T): boolean {
	// Check if the key exists and the value is an array
	return Array.isArray(obj[key]);
}
