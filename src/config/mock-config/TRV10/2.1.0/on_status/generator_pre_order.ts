import { SessionData } from "../../session-types";
import { onStatusMultipleStopsGenerator } from "./generator_multiple_stops";

function updateSettlementAmount(terms: any[], quote: any) {
  const total = Number(quote?.price?.value || 0);

  terms.forEach((termBlock) => {
    if (!termBlock.list) return;

    const buyerFeeItem =
      termBlock.list.find(
        (i: any) => i.descriptor?.code === "BUYER_FINDER_FEES_PERCENTAGE"
      ) || 1;
    const settlementItem = termBlock.list.find(
      (i: any) => i.descriptor?.code === "SETTLEMENT_AMOUNT"
    );

    if (buyerFeeItem && settlementItem) {
      const percentage = Number(buyerFeeItem.value || 0);
      const settlementAmount = ((total * percentage) / 100).toFixed(2);
      settlementItem.value = settlementAmount;
    }
  });

  return terms;
}

export async function onStatusPreOrderGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  existingPayload = await onStatusMultipleStopsGenerator(
    existingPayload,
    sessionData
  );
  // UPDATE SETTLEMENT AMOUNT BASED ON QUOTE PRICE
  // if (existingPayload.message.order.tags) {
  //   existingPayload.message.order.tags = updateSettlementAmount(
  //     existingPayload.message.order.tags,
  //     sessionData.quote
  //   );
  // }
  existingPayload.message.order.tags = (sessionData as any).confirm_tags?.flat();

  if(!(sessionData as any).status_message.ref_id){
      existingPayload.error = {
        message:"Ref_id is not present in status call inside message object",
        code:"REF_ID_MISSING",
        valid: false
      }
  }

  else if((sessionData as any).status_message.order_id){
      existingPayload.error = {
        message:"Order_id is not needed in case of technical cancellation flow",
        code:"ORDER_ID_MISMATCH",
        valid: false
      }
  }

  else if((sessionData as any).status_message.ref_id!==existingPayload.context.transaction_id){
      existingPayload.error = {
        message:"Ref_id is not matching with transaction_id",
        code:"REF_ID_MISMATCH",
        valid: false
      }
  }

  return existingPayload;
}
