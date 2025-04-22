import { SessionData } from "../../../session-types";

export const onConfirmGenerator = (
  existingPayload: any,
  sessionData: SessionData
) => {

  // You can add more dynamic fields as needed:
  if (sessionData?.items) {
    existingPayload.message.order.items = sessionData.items;
  }

  // Return the updated payload
  return existingPayload;
};
