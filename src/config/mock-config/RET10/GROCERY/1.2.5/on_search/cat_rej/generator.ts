import { SessionData } from "../../../../session-types";

export async function cat_rej_generator(existingPayload: any, sessionData: SessionData) {
  
  delete existingPayload.message;
  
  existingPayload.errors = [
    {
      type: "ITEM-ERROR",
      code: "91001",
      message: "Item price > MRP",
      path: "message.catalog.bpp/providers[?(@.id=='e2008459-7e90-493e-b02e-cae52ca53214')].items[?(@.id=='1b7ecabd-b5cc-4296-ad98-5c139c0ed7d7')].price.value"
    },
    {
      type: "ITEM-ERROR",
      code: "91001",
      message: "Item price > MRP",
      path: "message.catalog.bpp/providers[?(@.id=='e2008459-7e90-493e-b02e-cae52ca53214')].items[?(@.id=='b1f9397b-0986-49bb-a759-ea3c36e4b2a9')].price.value"
    },
    {
      type: "ITEM-ERROR",
      code: "91001",
      message: "Item price > MRP",
      path: "message.catalog.bpp/providers[?(@.id=='e2008459-7e90-493e-b02e-cae52ca53214')].items[?(@.id=='0984d1dd-b5ea-417f-9104-68a2ec40dbd4')].price.value"
    }
  ];

  return existingPayload;
}
