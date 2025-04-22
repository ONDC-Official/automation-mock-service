import { SessionData } from "../../../session-types";

export const onSearchGenerator = (
  existingPayload: any,
  sessionData: SessionData
) => {
  // Create a deep copy of the existing payload to avoid mutation
  const payload = JSON.parse(JSON.stringify(existingPayload));

  // Handle BPP ID and URI from session data
  if (sessionData.bpp_id) {
    payload.context.bpp_id = sessionData.bpp_id;
  }
  if (sessionData.bpp_uri) {
    payload.context.bpp_uri = sessionData.bpp_uri;
  }

  // Check if item availability feature (001) is enabled
  if (sessionData.item_availability_enabled) {
    const providers = payload.message.catalog["bpp/providers"];
    
    // Add timing information to each item
    providers.forEach((provider: any) => {
      provider.items.forEach((item: any) => {
        // Add time object if not present
        if (!item.time) {
          item.time = {
            label: "enable",
            timestamp: new Date().toISOString()
          };
        }

        // Add timing tags if not present
        const hasTimingTag = item.tags?.some((tag: any) => tag.code === "timing");
        if (!hasTimingTag) {
          item.tags = item.tags || [];
          item.tags.push({
            code: "timing",
            list: [
              { code: "day_from", value: "1" }, // Monday
              { code: "day_to", value: "5" },   // Friday
              { code: "time_from", value: "1800" }, // 6:00 PM
              { code: "time_to", value: "2200" }    // 10:00 PM
            ]
          });
        }
      });
    });
  }

  // If specific timing data is provided in session, use that instead
  if (sessionData.item_timing) {
    const providers = payload.message.catalog["bpp/providers"];
    
    providers.forEach((provider: any) => {
      provider.items.forEach((item: any) => {
        // Update time object with null checks
        item.time = {
          label: "enable",
          timestamp: sessionData.item_timing?.timestamp || new Date().toISOString()
        };

        // Update or create timing tags
        let timingTag = item.tags?.find((tag: any) => tag.code === "timing");
        if (!timingTag) {
          timingTag = { code: "timing", list: [] };
          item.tags = item.tags || [];
          item.tags.push(timingTag);
        }

        // Update timing values with null checks
        timingTag.list = [
          { code: "day_from", value: sessionData.item_timing?.day_from || "1" },
          { code: "day_to", value: sessionData.item_timing?.day_to || "5" },
          { code: "time_from", value: sessionData.item_timing?.time_from || "1800" },
          { code: "time_to", value: sessionData.item_timing?.time_to || "2200" }
        ];
      });
    });
  }
  return payload;
};
