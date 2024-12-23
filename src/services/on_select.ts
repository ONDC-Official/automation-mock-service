import extractPayloadData from "../utils/extract-payload-data";
import { resolveTemplate } from "../utils/template_parser";
import init from "../templates/init.json";
import { sendResponse } from "../utils/api";
import { getFromCache } from "../utils/redis";
import { generateRandomUUID } from "../utils/generate_uuids";
import { CACHE_DB_2 } from "../constants/constants";
import { json } from "body-parser";

const handleOnSelectRequest = async (payload: any) => {
    let json_cache_data: any = await getFromCache(payload.context.transaction_id,CACHE_DB_2);
    const extracted_data:any = {}
    extracted_data["message_id"] = generateRandomUUID()
    extracted_data["timestamp"] = new Date().toISOString();
    const combined_data = {...json_cache_data,...extracted_data}
    const responsePayload = resolveTemplate(init, combined_data);
    sendResponse(responsePayload, "init");
  };


  export default handleOnSelectRequest;