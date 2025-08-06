import { SessionData } from "../../../../session-types";

export async function search_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;
  let codesArray = sessionData?.user_inputs?.feature_discovery || [];
  const tags = existingPayload.message.intent.tags as any[];
  if (codesArray.length > 0)
    tags.push({
      code: "bap_features",
      list: [
        ...codesArray.map((code: string) => {
          return {
            code: code,
            value: "yes",
          };
        }),
      ],
    });
  return existingPayload;
}
