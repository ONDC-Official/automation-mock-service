import { SessionData } from "../../../../session-types";

export async function update_delivery_address(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload.message.order.id = sessionData.order_id
  const ids = sessionData.fulfillments.filter((f:any) => f.type === "Delivery").map((f:any) => f.id);
  existingPayload.message.order.fulfillments = ids.map((id:any) => ({
    id,
    end: {
        location: {
            gps: "12.4535,77.9283",
            address: {
              name: "My new House",
              building: "Bldg 7 new ",
              locality: "MG Road",
              city: "Bengaluru",
              state: "Karnataka",
              country: "IND",
              area_code: "560037"
            }
          },
          person: {
            name: "Buyer 1"
          },
          contact: {
            phone: "9886098860"
          }
    }
  }));
  return existingPayload;
}
