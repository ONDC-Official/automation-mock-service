import { SessionData } from "../../../../session-types";

function updateTimestamps(obj: any) {
    const currentTimestamp = new Date().toISOString();
    
    function recursiveUpdate(current: any) {
        if (typeof current !== 'object' || current === null) {
            return;
        }
        
        for (const key in current) {
            if (key === 'timestamp' && typeof current[key] === 'string') {
                current[key] = currentTimestamp;
            } else if (typeof current[key] === 'object') {
                recursiveUpdate(current[key]);
            }
        }
    }
    
    recursiveUpdate(obj);
    return obj;
}

export async function catalog_rejection_generator(
  existingPayload: any,
  sessionData: SessionData
) {

  existingPayload = updateTimestamps(existingPayload);

  if (existingPayload.context) {
    existingPayload.context.city = "*";
    existingPayload.context.action = "catalog_rejection";
  }

  delete existingPayload.message;

  if (!existingPayload.errors) {
    existingPayload.errors = [];
  }

  const items = sessionData.on_search_items || [];

  for (const item of items) {
    const price = parseFloat(item.price?.value || "0");
    const mrp = parseFloat(item.price?.maximum_value || "0");

    if (price > mrp) {
      existingPayload.errors.push({
        type: "ITEM-ERROR",
        code: "91001",
        message: "Item price > MRP",
        path: `sessionData.on_search_items[?(@.id=='${item.id}')].price.value`
      });
    }
  }

  existingPayload.errors.push({
    type: "PROVIDER-ERROR",
    code: "90003",
    message: "Select call failure more than published threshold",
    path: "sessionData.on_search_items"
  });

  return existingPayload;
}
