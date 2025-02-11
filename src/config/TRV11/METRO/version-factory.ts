import { SessionData } from "../session-types";
import { createMockReponse2 } from "./2.0.1/generation-pipline";
import { createMockReponse1 } from "./2.0.0/generation-pipline";
 
export async function createMockResponse(version: string,sessionData: SessionData,action_id: string){
    console.log("The version is", version)
    if(version === "2.0.0"){
        return createMockReponse1(action_id,sessionData)
    } else if(version === "2.0.1"){
        return createMockReponse2(action_id,sessionData)
    }

}