import { SessionData } from "../../RET11/session-types";
import { RedisService } from "ondc-automation-cache-lib";
import { SessionCache } from "../../../types/api-session-cache";
import { createBuyerUrl, createSellerUrl } from "../../../utils/request-utils";
import { createMockReponseRET } from "./../../RET11/F&B/1.2.5/generation-pipeline";

export async function createMockResponse(
  session_id: string,
  sessionData: SessionData,
  action_id: string,
  inputs?: Record<any, any>
) {
  RedisService.useDb(0);
  console.log("session id in create mock response", session_id);
  // const api_session = (await RedisService.getKey(session_id)) ?? "";
  // console.log("api_session is ", api_session);
  // const data = JSON.parse(api_session) as SessionCache;
  // console.log("data is", data);
  // const { version, usecaseId, domain } = data;
  // console.log(version, usecaseId);

  const data = {
    version: "1.2.5",
    subscriberUrl: "https://api.example.com/mock/ONDC:RET11/1.2.5/buyer",
    npType: "BAP",
    domain: "ONDC:RET11"
  }
  const { version, subscriberUrl, npType, domain } = data;

  let payload: any = {};

  payload = await createMockReponseRET(action_id, sessionData, domain, inputs);

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

  console.log("🚀 ~ payload:", JSON.stringify(payload,null,4))
  return payload;
}
