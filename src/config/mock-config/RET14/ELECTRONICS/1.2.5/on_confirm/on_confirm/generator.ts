import { SessionData } from "../../../../session-types";
import { getUpdatedBilling } from "../../api-objects/billing";
import { createFulfillments } from "../../api-objects/fulfillments";
import { TagsType } from "../../api-objects/tags";

export async function on_confirm_generator(
    existingPayload: any,
    sessionData: SessionData
) {
    console.log("on_confirm_generator called");
    console.log("sessionData:", JSON.stringify(sessionData));
    console.log("sessionData.provider:", JSON.stringify(sessionData?.provider));
    console.log("sessionData.items:", JSON.stringify(sessionData?.items));
    console.log("sessionData.quote:", JSON.stringify(sessionData?.quote));
    console.log("sessionData.payment:", JSON.stringify(sessionData?.payment));
    console.log("sessionData.billing:", JSON.stringify(sessionData?.billing));

    const timeIso = new Date().toISOString();
    existingPayload.message.order.updated_at = timeIso;
    existingPayload.message.order.created_at = sessionData.order_created_at;
    existingPayload.message.order.id = sessionData.order_id;
    existingPayload.message.order.billing = getUpdatedBilling(
        sessionData.billing
    );
    console.log(
        "Updated billing:",
        JSON.stringify(existingPayload.message.order.billing)
    );

    existingPayload.message.order.items = sessionData.items;
    existingPayload.message.order.provider = sessionData.provider;
    console.log(
        "Provider set in order:",
        JSON.stringify(existingPayload.message.order.provider)
    );

    existingPayload.message.order.fulfillments = createFulfillments(
        "on_confirm",
        "on_confirm",
        sessionData,
        existingPayload.message.order.fulfillments
    );
    console.log(
        "Fulfillments generated:",
        JSON.stringify(existingPayload.message.order.fulfillments)
    );
    existingPayload.message.order.quote = sessionData.quote;
    existingPayload.message.order.payment = sessionData.payment;
    const existingTags = existingPayload.message.order.tags as TagsType;
    console.log("Existing tags:", JSON.stringify(existingTags));
    const bapTerms = existingTags.find((f: any) => f.code === "bap_terms");
    console.log("bapTerms found:", JSON.stringify(bapTerms));

    if (bapTerms) {
        bapTerms.list = sessionData.bap_terms.list
            .filter((i: any) => i.code !== "accept_bpp_terms") // remove
            .map((i: any) =>
            i.code === "static_terms"
                ? { ...i, value: "https://github.com/ONDC-Official/protocol-network-extension/discussions/79" }
                : i
        );
    }
    existingPayload.message.order.updated_at = existingPayload.context.timestamp;
    console.log(
        "Final on_confirm payload:",
        JSON.stringify(existingPayload)
    );
    return existingPayload;
}