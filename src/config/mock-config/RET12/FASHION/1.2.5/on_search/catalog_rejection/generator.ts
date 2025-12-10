// import { SessionData } from "../../../../session-types";
// import { updateTimestamps } from "../../api-objects/utils";

// export async function catalog_rejection_generator(
//   existingPayload: any,
//   sessionData: SessionData
// ) {
//   // Update timestamps in context if present
//   existingPayload = updateTimestamps(existingPayload);

//   // Since this is a rejection response, BAP will usually wildcard the city
//   if (existingPayload.context) {
//     existingPayload.context.city = "*";
//     existingPayload.context.action = "catalog_rejection"; // as per rejection callback type
//   }
//   delete existingPayload.message
// // //   Ensure rejection errors structure exists
//   if (!existingPayload.errors) {
//     existingPayload.errors = [];
//   }

// // //   Populate errors from rejection YAML
//   existingPayload.errors = [
//     {
//       type: "ITEM-ERROR",
//       code: "91001",
//       message: "Item price > MRP",
//       path:
//         "message.catalog.bpp/providers[?(@.id=='e2008459-7e90-493e-b02e-cae52ca53214')].items[?(@.id=='1b7ecabd-b5cc-4296-ad98-5c139c0ed7d7')].price.value"
//     },
//     {
//       type: "ITEM-ERROR",
//       code: "91001",
//       message: "Item price > MRP",
//       path:
//         "message.catalog.bpp/providers[?(@.id=='e2008459-7e90-493e-b02e-cae52ca53214')].items[?(@.id=='b1f9397b-0986-49bb-a759-ea3c36e4b2a9')].price.value"
//     },
//     {
//       type: "ITEM-ERROR",
//       code: "91001",
//       message: "Item price > MRP",
//       path:
//         "message.catalog.bpp/providers[?(@.id=='e2008459-7e90-493e-b02e-cae52ca53214')].items[?(@.id=='0984d1dd-b5ea-417f-9104-68a2ec40dbd4')].price.value"
//     }
//   ];

//   return existingPayload;
// }


import { logger } from "../../../../../../../utils/logger";
import { SessionData } from "../../../../session-types";
import { updateTimestamps } from "../../api-objects/utils";

export async function catalog_rejection_generator(
  existingPayload: any,
  sessionData: SessionData
) {
  logger.info("Session Data:", sessionData);

  // Update timestamps in context
  existingPayload = updateTimestamps(existingPayload);

  // Set rejection context
  if (existingPayload.context) {
    existingPayload.context.city = "*";
    existingPayload.context.action = "catalog_rejection";
  }

  // Delete message if not needed
  delete existingPayload.message;

  // Ensure errors array exists
  if (!existingPayload.errors) {
    existingPayload.errors = [];
  }

  // Dynamically check items from sessionData
  const items = sessionData.on_search_items || [];

  for (const item of items) {
    const price = parseFloat(item.price?.value || "0");
    const mrp = parseFloat(item.price?.maximum_value || "0"); // Using sessionData price.max

    if (price > mrp) {
      existingPayload.errors.push({
        type: "ITEM-ERROR",
        code: "91001",
        message: "Item price > MRP",
        path: `sessionData.on_search_items[?(@.id=='${item.id}')].price.value`
      });
    }
  }

  // Example additional provider-level error if needed
  existingPayload.errors.push({
    type: "PROVIDER-ERROR",
    code: "90003",
    message: "Select call failure more than published threshold",
    path: "sessionData.on_search_items"
  });

  return existingPayload;
}
