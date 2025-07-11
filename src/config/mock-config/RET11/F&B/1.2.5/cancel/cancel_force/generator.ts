import { SessionData, Input } from "../../../../session-types";

export const cancelForceGenerator = async (
  existingPayload: any,
  sessionData: SessionData
) => {
  if (sessionData?.order_id) {
    existingPayload.message.order_id = sessionData.order_id;
  }

  await new Promise((resolve) => setTimeout(resolve, 10000));

  return existingPayload;
};
