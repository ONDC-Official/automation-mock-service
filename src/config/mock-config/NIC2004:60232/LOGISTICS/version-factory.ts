import { SessionData } from "../session-types";
import { ApiServiceCache, RedisService } from "ondc-automation-cache-lib";
import { SessionCache } from "../../../../types/api-session-cache";
import { createBuyerUrl, createSellerUrl } from "../../../../utils/request-utils";

import { createMockReponseLOGISTICS200 } from "./1.2.5/generation-pipeline";

export async function createMockResponse(
  session_id: string,
  sessionData: SessionData,
  action_id: string,
  inputs?: Record<any, any>
) {
  RedisService.useDb(0);
  console.log("session id in create mock response", session_id);
  const api_session = (await RedisService.getKey(session_id)) ?? "";
  const data = JSON.parse(api_session) as SessionCache;
  const { version, usecaseId, domain } = data;
  console.log(version, usecaseId);

  let payload: any = {};

  payload = await createMockReponseLOGISTICS200(action_id, sessionData, domain, inputs);

  if (data.npType === "BAP") {
    payload.context.bap_uri = data.subscriberUrl;
    payload.context.bpp_uri = createSellerUrl(data.domain, data.version);
  } else {
    payload.context.bpp_uri = data.subscriberUrl;
    payload.context.bap_uri = createBuyerUrl(data.domain, data.version);
  }

  if (action_id.startsWith("search")) {
    delete payload.context.bpp_id;
    delete payload.context.bpp_uri;
  }

  return payload;
}
