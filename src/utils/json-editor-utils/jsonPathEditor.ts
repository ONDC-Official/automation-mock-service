import jsonpath from "jsonpath";
import logger from "../logger";

/**
 * Updates a JSON object at a specific JSONPath with a new value.
 *
 * @param json - The JSON object to update.
 * @param jsonPath - The JSONPath specifying the location to update.
 * @param newValue - The new value to set at the specified JSONPath.
 * @returns - The updated JSON object.
 */
function updateJsonPath<T extends object>(
	json: T,
	jsonPath: string,
	newValue: any
): T {
	try {
		jsonpath.apply(json, jsonPath, (_) => newValue);
		return json;
	} catch (err) {
		logger.info(
			`Error in updating JSONPath ${jsonPath} with value ${newValue}: ${err}`
		);
		throw new Error(
			`Error in updating JSONPath ${jsonPath} with value ${newValue}: ${err}`
		);
	}
}

/**
 * Updates multiple JSONPaths in a JSON object with new values.
 *
 * @param json - The JSON object to update.
 * @param pathObject - An object mapping JSONPaths to their new values.
 * @returns - The updated JSON object.
 */
export function updateAllJsonPaths<T extends object>(
	json: T,
	pathObject: Record<string, any>
): T {
	for (const jsonPath in pathObject) {
		const value = pathObject[jsonPath];
		json = updateJsonPath(json, jsonPath, value);
	}
	return json;
}
