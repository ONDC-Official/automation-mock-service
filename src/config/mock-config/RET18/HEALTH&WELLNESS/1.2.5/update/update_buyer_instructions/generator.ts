import { SessionData } from "../../../../session-types";

export async function update_buyer_instructions(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.message.order.id = sessionData.order_id
  const ids = sessionData.fulfillments.filter((f:any) => f.type === "Delivery").map((f:any) => f.id);
  existingPayload.message.order.fulfillments = ids.map((id:any) => ({
    id,
    end: {
      instructions: {
        long_desc: "Leave package outside the door and do not ring the bell.",
        additional_desc: {
          content_type: "text/html",
          url: "url for additional info"
        }
      }
    }
  }));
  return existingPayload;
}
