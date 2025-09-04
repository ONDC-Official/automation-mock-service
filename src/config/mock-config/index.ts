import { readFileSync } from "fs";
import logger from "@ondc/automation-logger";
import path from "path";
import yaml from "js-yaml";
import { SessionData as MockSessionData } from "./FIS11/session-types";
import { createFIS11MockResponse } from "./FIS11/version-factory";
import { getFIS11MockAction } from "./FIS11/action-factory";

export { MockSessionData };

const actionConfigFIS11 = yaml.load(
  readFileSync(path.join(__dirname, "./FIS11/factory.yaml"), "utf8")
) as any;

export const defaultSessionData = () =>
  yaml.load(
    readFileSync(path.join(__dirname, "./FIS11/session-data.yaml"), "utf8")
  ) as { session_data: MockSessionData };

export async function generateMockResponse(
  session_id: string,
  sessionData: any,
  action_id: string,
  input?: any
) {
  try {
    let response = await createFIS11MockResponse(
        session_id,
        sessionData,
        action_id,
        input
      );
    response.context.timestamp = new Date().toISOString();
    return response;
  } catch (e) {
    logger.error("Error in generating mock response", e);
    throw e;
  }
}

export function getMockActionObject(actionId: string) {
    return getFIS11MockAction(actionId);
  
}

export function getActionData(code: number) {
  let actionData = actionConfigFIS11.codes.find((action: any) => action.code === code);
  if (actionData) {
    return actionData;
  }
  throw new Error(`Action code ${code} not found`);
}

export function getSaveDataContent(version: string, action: string) {
  let actionFolderPath= path.resolve(__dirname, `./FIS11/${version}/${action}`);
  const saveDataFilePath = path.join(actionFolderPath, "save-data.yaml");
  const fileContent = readFileSync(saveDataFilePath, "utf8");
  const cont = yaml.load(fileContent) as any;
  console.log(cont);
  return cont;
}

export function getUiMetaKeys(): (keyof MockSessionData)[] {
	return ["first_form_testing"];
}