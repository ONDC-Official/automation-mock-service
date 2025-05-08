import { readFileSync } from "fs";
import { logger, logInfo } from "../../utils/logger";

import path from "path";
import yaml from "js-yaml";
import { SessionData as MockSessionData } from "./TRV11/session-types";
import { createMockResponse } from "./TRV11/version-factory";

export { MockSessionData };

const actionConfig = yaml.load(
  readFileSync(path.join(__dirname, "./TRV11/factory.yaml"), "utf8")
) as any;

export const defaultSessionData = yaml.load(
  readFileSync(path.join(__dirname, "./TRV11/session-data.yaml"), "utf8")
) as { session_data: MockSessionData };

export async function generateMockResponse(
  session_id: string,
  sessionData: any,
  action_id: string
) {
  try {
    return await createMockResponse(session_id, sessionData, action_id);
  } catch (e) {
    logger.error("Error in generating mock response", e);
    throw e;
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
    `./TRV11/METRO/${version}/${action}`
  );
  if (/\/update$/.test(actionFolderPath)) {
    actionFolderPath += "_";
  }
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
