import { SessionData } from "./session-types";
import { createMockResponseMETRO201 } from "./METRO/2.0.1/generation-pipline";
import { createMockResponseMETRO200 } from "./METRO/2.0.0/generation-pipline";
import { ApiServiceCache, RedisService } from "ondc-automation-cache-lib";
import { SessionCache } from "../../../types/api-session-cache";
import { createMockReponseBUS200 } from "./BUS/2.0.0/generation-pipline";
import { createBuyerUrl, createSellerUrl } from "../../../utils/request-utils";
import { createMockResponseBUS201 } from "./BUS/2.0.1/generation-pipline";

export async function createMockResponse(
  session_id: string,
  sessionData: SessionData,
  action_id: string
) {
  RedisService.useDb(0);
  console.log("session id in create mock response", session_id);
  const api_session = (await RedisService.getKey(session_id)) ?? "";
  console.log("api_session is ", api_session);
  const data = JSON.parse(api_session) as SessionCache;
  console.log("data is", data);
  const { version, usecaseId } = data;
  // let version = "2.0.1"
  // let usecaseId = "BUS"
  let payload: any = {};

  if (usecaseId === "Metro") {
    if (version === "2.0.0") {
      payload = await createMockResponseMETRO200(action_id, sessionData);
    } else if (version === "2.0.1") {
      payload = await createMockResponseMETRO201(action_id, sessionData);
    }
  } else if (usecaseId === "Bus") {
    if (version === "2.0.0") {
      payload = await createMockReponseBUS200(action_id, sessionData);
    } else if (version === "2.0.1") {
      payload = await createMockResponseBUS201(action_id, sessionData);
    }
  }

  if (data.npType === "BAP") {
    payload.context.bap_uri = data.subscriberUrl;
    payload.context.bpp_uri = createSellerUrl(data.domain, data.version);
  } else {
    if (payload.context.action !== "search") {
      payload.context.bpp_uri = data.subscriberUrl;
    }
    payload.context.bap_uri = createBuyerUrl(data.domain, data.version);
  }

  return payload;
}
