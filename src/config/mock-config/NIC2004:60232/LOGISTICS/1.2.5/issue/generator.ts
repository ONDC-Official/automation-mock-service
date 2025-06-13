import { SessionData } from "../../../session-types";
import { getFutureDateInMinutes, isEmpty } from "../../../../../../utils/generic-utils";

export const issueStatusGenerator = async (
  existingPayload: any,
  sessionData: SessionData
) => {
  existingPayload.message.issue.id = sessionData.latest_issue_payload?.id || "ISSUE-1";
  existingPayload.message.issue.created_at = sessionData.latest_issue_payload?.created_at || new Date().toISOString();
  existingPayload.message.issue.updated_at = new Date().toISOString();
  existingPayload.message.issue.expected_response_time =
  sessionData.latest_issue_payload?.expected_response_time || { duration: "PT2H" };
  existingPayload.message.issue.expected_resolution_time =
  sessionData.latest_issue_payload?.expected_resolution_time || { duration: "P1D" };

  const provider = sessionData.provider_id;
  let fulfillment = "F1";
  if(sessionData.fulfillments){
    fulfillment = sessionData.fulfillments[0].id;
  }
  const item = sessionData.items[0].id;
  const order = sessionData.order_id;
  const refs = [
    {
      "ref_id": order,
      "ref_type": "ORDER"
    },
    {
      "ref_id": provider,
      "ref_type": "PROVIDER"
    },
    {
      "ref_id": fulfillment,
      "ref_type": "FULFILLMENT"
    },
    {
      "ref_id": item,
      "ref_type": "ITEM",
      "tags": [
        {
          "descriptor": {
            "code": "message.order.items"
          },
          "list": [
            {
              "descriptor": {
                "code": "quantity.selected.count"
              },
              "value": "1"
            }
          ]
        }
      ]
    }
  ];
  existingPayload.message.issue.refs = sessionData.latest_issue_payload?.refs || refs;
  existingPayload.message.issue.actors = sessionData.latest_issue_payload?.actors || existingPayload.message.issue.actors;
  existingPayload.message.issue.source_id = sessionData.latest_issue_payload?.source_id || existingPayload.message.issue.source_id;
  existingPayload.message.issue.complainant_id = sessionData.latest_issue_payload?.complainant_id || "NP1";
  existingPayload.message.issue.descriptor.code = sessionData.latest_issue_payload?.descriptor.code || "ITM004";
  existingPayload.message.issue.descriptor.short_desc = sessionData.latest_issue_payload?.descriptor.short_desc || "Issue with product quality";
  existingPayload.message.issue.descriptor.long_desc = sessionData.latest_issue_payload?.descriptor.long_desc || "Product quality is not correct. facing issues while using the product";
  existingPayload.message.issue.descriptor.additional_desc.url = sessionData.latest_issue_payload?.additional_desc?.url || "https://example.com/issue-details";
  existingPayload.message.issue.descriptor.additional_desc.content_type  = sessionData.latest_issue_payload?.additional_desc?.content_type || "text/html";
  existingPayload.message.issue.descriptor.images.url = sessionData.latest_issue_payload?.descriptor?.image?.url || "https://example.com/image.jpg";
   sessionData.latest_issue_payload?.descriptor?.images || [
    {
        url: "https://example.com/image.jpg",
        size_type: "2MB",
    },
    ];
  existingPayload.message.issue.descriptor.media.url = sessionData.latest_issue_payload?.descriptor.media?.url || "https://example.com/media.mp4";
  existingPayload.message.issue.last_action_id = sessionData.last_action || "on_status";

  // Update status and descriptors
  existingPayload.message.issue.status = sessionData.status || "OPEN";
  if(sessionData.igm_action === "issue_open" ) {
    existingPayload.message.issue.status = "OPEN";
    existingPayload.message.issue.descriptor.short_desc = "Issue with product quality"
    existingPayload.message.issue.last_action_id = sessionData.last_action || "AL1";

  }
  if(sessionData.igm_action === "issue_close" ) {
    existingPayload.message.issue.status = "CLOSED";
    existingPayload.message.issue.last_action_id = sessionData.last_action || "AL8";

  }
  if(sessionData.igm_action === "issue_info_provided" ) {
    existingPayload.message.issue.status = "INFO_PROVIDED";
    existingPayload.message.issue.last_action_id = sessionData.last_action || "AL4";
  }
  if(sessionData.igm_action === "issue_resolution_accept" ) {
    existingPayload.message.issue.status = "PROCESSING";
    existingPayload.message.issue.last_action_id = sessionData.last_action || "AL7";
  }
  //@ts-ignore
  sessionData.test = "hell";
  return existingPayload;
};
