import { RedisService } from "ondc-automation-cache-lib";
import { Input, SessionData } from "./session-types";
import { createMockResponseRET10_125 } from "./GROCERY/1.2.5/generation-pipeline";
import { createBuyerUrl, createSellerUrl } from "../../../utils/request-utils";

export async function createMockResponse(
	session_id: string,
	sessionData: SessionData,
	action_id: string,
	input?: Input
) {
	const api_session = (await RedisService.getKey(session_id)) ?? null;
	if (!api_session) {
		throw new Error("Session not found");
	}
	sessionData.user_inputs = input;
	sessionData.protocol_session_id = session_id;
	const data = JSON.parse(api_session);
	const { version, usecaseId } = data;
	let payload: any = {};
	console.log("version", version, "usecaseId", usecaseId);
	if (usecaseId === "GROCERY") {
		if (version === "1.2.5") {
			payload = await createMockResponseRET10_125(action_id, sessionData);
		} else {
			throw new Error("version not found");
		}
	} else {
		throw new Error("Usecase not found");
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
