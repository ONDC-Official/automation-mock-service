import { randomUUID } from "crypto";
import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import { createFulfillments } from "../../api-objects/fulfillments";
import { TagsType } from "../../api-objects/tags";

export async function on_confirm_seller_cred_generator(
    existingPayload: any,
    sessionData: SessionData
) {
    
    const timeIso = new Date().toISOString();
    existingPayload.message.order.updated_at = timeIso;
    existingPayload.message.order.created_at = sessionData.order_created_at;
    existingPayload.message.order.id = sessionData.order_id;
    existingPayload.message.order.billing = getUpdatedBilling(
        sessionData.billing
    );
    existingPayload.message.order.items = sessionData.items;
    existingPayload.message.order.provider = sessionData.provider;
    existingPayload.message.order.fulfillments = createFulfillments(
        "on_confirm",
        "on_confirm",
        sessionData,
        existingPayload.message.order.fulfillments
    );
    existingPayload.message.order.quote = sessionData.quote;
    existingPayload.message.order.payment = sessionData.payment;
    const existingTags = existingPayload.message.order.tags as TagsType;
    const bapTerms = existingTags.find((f: any) => f.code === "bap_terms");
    if (bapTerms) {
        bapTerms.list = sessionData.bap_terms.list;
    }
    existingPayload.message.order.provider.creds = existingPayload.message.order.provider.creds || [];
    existingPayload.message.order.provider.creds.push({
        id: randomUUID().toString(),
        descriptor: {
            code : "Seller_Credential",
            type: "GI"
        }
    });
    return existingPayload;
}