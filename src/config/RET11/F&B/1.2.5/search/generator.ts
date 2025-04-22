import { SessionData } from "../../../session-types";

export const searchGenerator = (
  existingPayload: any,
  sessionData: SessionData
) => {
    // Create a deep copy of the existing payload to avoid mutation
    const payload = JSON.parse(JSON.stringify(existingPayload));

    // Check if bnp_features exists in sessionData
    if (sessionData.bnp_features) {
      // Find or create the bnp_features tag in the payload
      let bnpFeaturesTag = payload.message.intent.tags.find(
        (tag: any) => tag.code === "bnp_features"
      );
  
      if (!bnpFeaturesTag) {
        bnpFeaturesTag = {
          code: "bnp_features",
          list: []
        };
        payload.message.intent.tags.push(bnpFeaturesTag);
      }
  
      // Clear existing features and add the ones from sessionData
      bnpFeaturesTag.list = Object.entries(sessionData.bnp_features).map(
        ([code, value]) => ({
          code,
          value: value ? "yes" : "no" // Convert boolean to "yes"/"no"
        })
      );
    }
  
    // Handle other session data mappings
    if (sessionData.domain) {
      payload.context.domain = sessionData.domain;
    }
    if (sessionData.transaction_id) {
      payload.context.transaction_id = sessionData.transaction_id;
    }
    if (sessionData.message_id) {
      payload.context.message_id = sessionData.message_id;
    }
    if (sessionData.bap_id) {
      payload.context.bap_id = sessionData.bap_id;
    }
    if (sessionData.bap_uri) {
      payload.context.bap_uri = sessionData.bap_uri;
    }
    if (sessionData.city_code) {
      payload.context.city = sessionData.city_code;
    }
  
    return payload;
};
