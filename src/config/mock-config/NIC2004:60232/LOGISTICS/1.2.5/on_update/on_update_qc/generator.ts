import { populateFulfillmentUpdate } from "../../common_generator";
import { getTimestampFromDuration } from "../../../../../../../utils/generic-utils";
import { SessionData } from "../../../../session-types";

interface Tag {
  code: string;
  list: { code: string; value: string }[];
}

function removeTagsByCodes(tags: Tag[], codesToRemove: string[]): Tag[] {
  return tags.filter((tag) => !codesToRemove.includes(tag.code));
}

export const onUpdateQCGenerator = (
  existingPayload: any,
  sessionData: SessionData
) => {
  existingPayload.message.order.id = sessionData.order_id;
  const onConfirmFulfillments = sessionData.fulfillments;
  const updateFulfillments = sessionData.update_fulfillments;
  console.log(onConfirmFulfillments);
  
  console.log(updateFulfillments);
  
  if (onConfirmFulfillments && updateFulfillments) {
    function mergeFulfillments(
      confirmFulfillments: any[],
      updateFulfillments: any[]
    ) {
      const fulfillmentMap = new Map();
    
      // Step 1: Add all confirm call fulfillments (initial state)
      confirmFulfillments.forEach((f) => fulfillmentMap.set(f.id, f));
    
      // Step 2: Override with update call but preserve missing fields
      updateFulfillments.forEach((updated) => {
        const existing = fulfillmentMap.get(updated.id);
        if (existing) {
          // Merge deeply - you can use structured cloning or a deep merge utility
          fulfillmentMap.set(updated.id, {
            ...existing,
            ...updated,
            start: { ...existing.start, ...updated.start },
            end: { ...existing.end, ...updated.end },
            tags: updated.tags || existing.tags,
            state: updated.state || existing.state,
            agent: updated.agent || existing.agent,
          });
        } else {
          fulfillmentMap.set(updated.id, updated);
        }
      });
    
      // Step 3: Return final merged list
      return Array.from(fulfillmentMap.values());
    }
    const finalFulfillments = mergeFulfillments(
      onConfirmFulfillments,
      updateFulfillments
    );
    existingPayload.message.order.fulfillments = finalFulfillments;
  }

  existingPayload = populateFulfillmentUpdate(existingPayload, sessionData);

  existingPayload.message.order.fulfillments =
    existingPayload.message.order.fulfillments.map((fulfillmet: any) => {
      fulfillmet.tags = removeTagsByCodes(fulfillmet.tags, [
        "state",
        "rto_action",
        "weather_check",
      ]);

      return fulfillmet;
    });

  existingPayload.message.order.updated_at = existingPayload.context.timestamp;

  existingPayload.message.order.quote = sessionData.quote;
  if (
    Array.isArray(sessionData.cancellation_terms) &&
    sessionData.cancellation_terms.length > 0
  ) {
    existingPayload.message.order.cancellation_terms =
      sessionData.cancellation_terms;
  }

  if (sessionData.payment) {
    existingPayload.message.order.payment = sessionData.payment;
  }

  if (sessionData?.items) {
    existingPayload.message.order.items = sessionData.items;
  }

  if (sessionData?.billing) {
    existingPayload.message.order.billing = sessionData.billing;
  }

  if (sessionData?.quote) {
    existingPayload.message.order.quote = sessionData.quote;
  }

  return existingPayload;
};
