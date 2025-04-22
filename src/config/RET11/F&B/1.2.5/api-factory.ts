import { searchGenerator } from "./search/generator";
import { onSearchGenerator } from "./on_search/generator";
import { selectGenerator } from "./select/generator";
import { onSelectGenerator } from "./on_select/generator";
import { initGenerator } from "./init/generator";
import { onInitGenerator } from "./on_init/generator";
import { confirmGenerator } from "./confirm/generator";
import { onConfirmGenerator } from "./on_confirm/generator";

export async function Generator(
  action_id: string,
  existingPayload: any,
  sessionData: any,
  inputs?: Record<string, string>
) {
  console.log("inside generator");
  switch (action_id) {
    case "search":
      return await searchGenerator(existingPayload, sessionData);
    case "on_search":
      return await onSearchGenerator(existingPayload, sessionData);
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
