import { BecknContext } from "../../session-types";

export function createContext(partialContext: Partial<BecknContext>) {
  // const newContext
  const newContext: BecknContext = {
    domain: partialContext.domain || "ONDC:LOG10",
    country: "IND",
    city: "std:011",
    action: "search",
    core_version: "1.2.5",
    bap_id: "bap_id_not_set",
    bap_uri: "bap_uri_not_set",
    message_id: generateUuid(),
    timestamp: new Date().toISOString(),
    transaction_id: generateUuid(),
    ttl: "PT30S",
  };

  return { ...newContext, ...partialContext };
}

function generateUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}
