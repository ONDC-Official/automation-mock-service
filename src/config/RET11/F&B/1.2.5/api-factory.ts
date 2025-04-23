import { searchGenerator } from "./search/generator";
import { onSearchGenerator } from "./on_search/generator";
import { selectGenerator } from "./select/generator";
import { onSelectGenerator } from "./on_select/generator";
import { initGenerator } from "./init/generator";
import { onInitGenerator } from "./on_init/generator";
import { confirmGenerator } from "./confirm/generator";
import { onConfirmGenerator } from "./on_confirm/generator";
import { search1Generator } from "./search/search_1/generator";
import { onSearch1Generator } from "./on_search/on_search_1/generator";
import { onSearch2Generator } from "./on_search/on_search_2/generator";

export async function Generator(
  action_id: string,
  existingPayload: any,
  sessionData: any,
  inputs?: Record<string, string>
) {
  switch (action_id) {
    case "search":
      return await searchGenerator(existingPayload, sessionData);
    case "on_search":
      return await onSearchGenerator(existingPayload, sessionData);
    case "search_1":
      return await search1Generator(existingPayload, sessionData, inputs);
    case "on_search_1":
      return await onSearch1Generator(existingPayload, sessionData);
    case "on_search_2":
      return await onSearch2Generator(existingPayload, sessionData);
    case "select":
      return await selectGenerator(existingPayload, sessionData);
    case "on_select":
      return await onSelectGenerator(existingPayload, sessionData);
    case "init":
      return await initGenerator(existingPayload, sessionData);
    case "on_init":
      return await onInitGenerator(existingPayload, sessionData);
    case "confirm":
      return await confirmGenerator(existingPayload, sessionData);
    case "on_confirm":
      return await onConfirmGenerator(existingPayload, sessionData);
    default:
      throw new Error(`Invalid request type ${action_id}`);
  }
}
