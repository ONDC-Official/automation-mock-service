import { readFileSync } from "fs";
import { logger, logInfo } from "../../utils/logger";
import { createMockResponse } from "./NIC2004:60232/LOGISTICS/version-factory";
import path from "path";
import yaml from "js-yaml";
import { SessionData as MockSessionData } from "./NIC2004:60232/session-types";

export { MockSessionData };

const actionConfig = yaml.load(
  readFileSync(path.join(__dirname, "./NIC2004:60232/factory.yaml"), "utf8")
) as any;

export const defaultSessionData = yaml.load(
  readFileSync(
    path.join(__dirname, "./NIC2004:60232/session-data.yaml"),
    "utf8"
  )
) as { session_data: MockSessionData };

export async function generateMockResponse(
  session_id: string,
  sessionData: any,
  action_id: string,
  input?: any
) {
  try {
    return await createMockResponse(session_id, sessionData, action_id, input);
  } catch (e) {
    logger.error("Error in generating mock response", e);
    // throw e;
  }
}

export function getActionData(code: number) {
  const actionData = actionConfig.codes.find(
    (action: any) => action.code === code
  );
  if (actionData) {
    return actionData;
  }
  throw new Error(`Action code ${code} not found`);
}

export function getSaveDataContent(version: string, action: string) {
logInfo({
  message: "Entering getSaveDataContent Function.",
  meta: { version, action },
});  
let actionFolderPath = path.resolve(
    __dirname,
    `./NIC2004:60232/LOGISTICS/${version}/${action}`
  );

  const saveDataFilePath = path.join(actionFolderPath, "save-data.yaml");
  const fileContent = readFileSync(saveDataFilePath, "utf8");
  const cont = yaml.load(fileContent) as any;
  // console.log(cont);
  logInfo({
    message: "Exiting getSaveDataContent Function.",
    meta: { version, action, content: cont },
  });
  return cont;
}
