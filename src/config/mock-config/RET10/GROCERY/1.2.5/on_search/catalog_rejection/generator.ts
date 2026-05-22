import { logger } from "../../../../../../../utils/logger";
import { SessionData } from "../../../../session-types";
// import { updateTimestamps } from "../../api-objects/utils";

export async function catalog_rejection_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  logger.info("Session Data:", sessionData);

  // existingPayload = updateTimestamps(existingPayload);

  // Ensure context exists
  if (existingPayload.context) {
    existingPayload.context.city = "*";
    existingPayload.context.action = "catalog_rejection";
  }

  // Remove message block
  delete existingPayload.message;

  // Ensure errors array exists
  if (!Array.isArray(existingPayload.errors)) {
    existingPayload.errors = [];
  }

  const items = sessionData.on_search_items || [];

  logger.info("Total items received:", items.length);

  for (const item of items) {
    const value = item?.price?.value;
    const maximumValue = item?.price?.maximum_value;

    logger.info("Checking item:", {
      id: item?.id,
      value,
      maximumValue,
    });

    // Skip invalid/missing prices
    if (!value || !maximumValue) {
      logger.warn("Skipping item due to missing price fields", {
        id: item?.id,
      });
      continue;
    }

    const price = Number(value);
    const mrp = Number(maximumValue);

    // Skip invalid number conversion
    if (Number.isNaN(price) || Number.isNaN(mrp)) {
      logger.warn("Skipping item due to invalid numeric values", {
        id: item?.id,
        price,
        mrp,
      });
      continue;
    }

    logger.info("Parsed values:", {
      id: item?.id,
      price,
      mrp,
    });

    // Validation
    if (price > mrp) {
      logger.info("Price validation failed", {
        id: item?.id,
        price,
        mrp,
      });

      existingPayload.errors.push({
        type: "ITEM-ERROR",
        code: "91001",
        message: "Item price > MRP",
        path: `sessionData.on_search_items[?(@.id=='${item.id}')].price.value`,
      });
    }
  }

  // Add provider-level error
  existingPayload.errors.push({
    type: "PROVIDER-ERROR",
    code: "90003",
    message: "Select call failure more than published threshold",
    path: "sessionData.on_search_items",
  });

  logger.info(
    "Final Errors Payload:",
    JSON.stringify(existingPayload.errors, null, 2)
  );

  return existingPayload;
}