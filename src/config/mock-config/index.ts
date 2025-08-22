import { readFileSync } from "fs";
import { logger } from "../../utils/logger";
import path from "path";
import yaml from "js-yaml";
import { SessionData as MockSessionDataFIS13 } from "./FIS13/session-types";
import { createFIS13MockResponse } from "./FIS13/version-factory";
import { getFIS13MockAction } from "./FIS13/action-factory";

export {  MockSessionDataFIS13 };


const actionConfigFIS13 = yaml.load(
  readFileSync(path.join(__dirname, "./FIS13/factory.yaml"), "utf8")
) as any;

export const defaultSessionDataFIS13 = () =>
  yaml.load(
    readFileSync(path.join(__dirname, "./FIS13/session-data.yaml"), "utf8")
  ) as { session_data: MockSessionDataFIS13 };


export async function generateMockResponse(
  session_id: string,
  sessionData: any,
  action_id: string,
  input?: any
) {
  try {
    const domain = process.env.DOMAIN;

    let response: any = "";
    if (domain === "ONDC:FIS13") {
      response = await createFIS13MockResponse(
        session_id,
        sessionData,
        action_id,
        input
      );
    } 
    response.context.timestamp = new Date().toISOString();
    return response;
  } catch (e) {
    logger.error("Error in generating mock response", e);
    throw e;
  }
}

export function getMockActionObject(actionId: string) {
  const domain = process.env.DOMAIN;
  // if (domain === "ONDC:FIS13") {
    return getFIS13MockAction(actionId);
  // }
  
}

export function getActionData(code: number) {
  const domain = process.env.DOMAIN;
  let actionData:any = "";

  if (domain == "ONDC:FIS13") {
	actionData = actionConfigFIS13.codes.find((action: any) => action.code === code);

  } 
  if (actionData) {
    return actionData;
  }
  throw new Error(`Action code ${code} not found`);
}

export function getSaveDataContent(version: string, action: string) {
  const domain: any = process.env.DOMAIN;
  let actionFolderPath: any = "";
  if (domain === "ONDC: FIS13") {
    actionFolderPath = path.resolve(__dirname, `./ FIS13/${version}/${action}`);
  } 
  const saveDataFilePath = path.join(actionFolderPath, "save-data.yaml");
  const fileContent = readFileSync(saveDataFilePath, "utf8");
  const cont = yaml.load(fileContent) as any;
  console.log(cont);
  return cont;
}
