import { SessionData } from "../../../../session-types";

export const updateSettlelmentGenerator = (
  existingPayload: any,
  sessionData: SessionData,
  action_id: string
) => {
  if (sessionData.order_id) {
    existingPayload.message.order.id = sessionData.order_id;
  }

  let refundAmount = "";

  if (action_id === "update_settelment_cancel") {
    existingPayload.message.order.fulfillments[0].id =
      sessionData.fulfillments?.find(
        (fulfillment: any) => fulfillment.type === "Cancel"
      )?.id;
  } else if (action_id === "update_settelment_return") {
    sessionData.fulfillments?.forEach((fulfillment) => {
      if (fulfillment.type === "Return") {

        existingPayload.message.order.fulfillments = [
          {
            id: fulfillment.id,
            type: "Return",
          },
        ];
      }
    });

    refundAmount = (
      parseFloat(sessionData?.on_confirm_quote?.price?.value) -
      parseFloat(sessionData?.on_update_quote?.price?.value)
    ).toFixed(2).toString();
  } else if (action_id === "update_settelment_part_cancel") {
    refundAmount = (
      parseFloat(sessionData?.on_confirm_quote?.price?.value) -
      parseFloat(sessionData?.on_update_quote?.price?.value)
    ).toFixed(2).toString();
  }

  existingPayload.message.order.payment[
    "@ondc/org/settlement_details"
  ][0].settlement_amount = refundAmount;
  existingPayload.message.order.payment[
    "@ondc/org/settlement_details"
  ][0].settlement_timestamp = existingPayload.context.timestamp;

  return existingPayload;
};
