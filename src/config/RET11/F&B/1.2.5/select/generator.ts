import { SessionData } from "../../../session-types";

export const selectGenerator = (
  existingPayload: any,
  sessionData: SessionData
) => {
  const message = existingPayload.message;

  // Replace or augment items
  if (sessionData.items && sessionData.items.length > 0) {
    message.order.items = sessionData.items;

    // Add optional dynamic logic (e.g., ensure payment_ids if needed)
    const paymentId = Math.random().toString(36).substring(2, 12);
    message.order.items = message.order.items.map((item: any) => ({
      ...item,
      payment_ids: [paymentId],
    }));
  }

   // Add customization tags if specified in session data
   if (sessionData.customizations) {
    message.order.items = message.order.items.map((item: any) => {
      // Only process items that have customization type
      const isCustomization = item.tags?.some((tag: any) => 
        tag.code === "type" && tag.list?.some((t: any) => 
          t.code === "type" && t.value === "customization"
      ));
      
      if (isCustomization && sessionData.customizations[item.id]) {
        return {
          ...item,
          descriptor: {
            ...item.descriptor,
            tags: [
              ...(item.descriptor?.tags || []),
              {
                code: "customization",
                list: [
                  {
                    code: "input_text",
                    value: sessionData.customizations[item.id]
                  }
                ]
              }
            ]
          }
        };
      }
      return item;
    });
  }
  
  // Replace fulfillments if present
  if (sessionData.fulfillments && sessionData.fulfillments.length > 0) {
    message.order.fulfillments = sessionData.fulfillments;
  } else {
    // Normalize default type to "DELIVERY" and apply sessionData.end if present
    message.order.fulfillments = message.order.fulfillments?.map((f: any) => ({
      ...f,
      type: "DELIVERY",
      ...(sessionData.end && { end: sessionData.end }),
    }));
  }

  // Sanitize or override specific fields if needed
  if (message.order.fulfillments) {
    message.order.fulfillments.forEach((f: any) => {
      if (f?.type && f.type.toLowerCase() !== "delivery") {
        f.type = "DELIVERY";
      }
    });
  }

  return existingPayload;
};
