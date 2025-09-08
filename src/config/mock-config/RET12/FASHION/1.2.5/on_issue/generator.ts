import { SessionData } from "../../../session-types";

export const onIssueStatusGenerator = async (
  existingPayload: any,
  sessionData: SessionData
) => {
  const newDate = new Date().toISOString();
  existingPayload.message.issue.id =
    sessionData.latest_issue_payload?.id || "ISSUE-1";
  existingPayload.message.issue.created_at =
    sessionData.latest_issue_payload?.created_at || newDate;
  existingPayload.message.issue.updated_at = newDate;
  //   existingPayload.message.issue.expected_response_time = sessionData.latest_issue_payload?.expected_response_time || "PT2H";
  //   existingPayload.message.issue.expected_resolution_time = sessionData.latest_issue_payload?.expected_resolution_time || "P1D";
  existingPayload.message.issue.expected_response_time = sessionData
    .latest_issue_payload?.expected_response_time || { duration: "PT2H" };
  existingPayload.message.issue.expected_resolution_time = sessionData
    .latest_issue_payload?.expected_resolution_time || { duration: "P1D" };
  existingPayload.message.issue.refs =
    sessionData.latest_issue_payload?.refs ||
    existingPayload.message.issue.refs;
  existingPayload.message.issue.actors =
    sessionData.latest_issue_payload?.actors ||
    existingPayload.message.issue.actors;
  existingPayload.message.issue.source_id =
    sessionData.latest_issue_payload?.source_id ||
    existingPayload.message.issue.source_id;
  existingPayload.message.issue.complainant_id =
    sessionData.latest_issue_payload?.complainant_id || "NP1";
  existingPayload.message.issue.descriptor.code =
    sessionData.latest_issue_payload?.descriptor.code || "ITM004";
  existingPayload.message.issue.descriptor.short_desc =
    sessionData.latest_issue_payload?.descriptor.short_desc ||
    "Issue with product quality";
  existingPayload.message.issue.descriptor.long_desc =
    sessionData.latest_issue_payload?.descriptor.long_desc ||
    "Product quality is not correct. facing issues while using the product";
  existingPayload.message.issue.descriptor.additional_desc.url =
    sessionData.latest_issue_payload?.additional_desc?.url ||
    "https://example.com/issue-details";
  existingPayload.message.issue.descriptor.additional_desc.content_type =
    sessionData.latest_issue_payload?.additional_desc?.content_type ||
    "text/html";
  //   existingPayload.message.issue.descriptor.images.url = sessionData.latest_issue_payload?.images.url || "https://example.com/s.jpg";
  existingPayload.message.issue.descriptor.images = sessionData
    .latest_issue_payload?.descriptor?.images || [
    {
      url: "https://example.com/image.jpg",
      size_type: "2MB",
    },
  ];
  // existingPayload.message.issue.descriptor.media.url = sessionData.latest_issue_payload?.descriptor?.media?.url || "https://example.com/media.mp4";

  // Update status and descriptors
  // default status if not overridden
  existingPayload.message.issue.status = sessionData.status || "OPEN";

  switch (sessionData.igm_action) {
    case "on_issue_processing":
      existingPayload.message.issue.status = "PROCESSING";
      existingPayload.message.issue.descriptor.short_desc =
        "Issue with product quality";
      existingPayload.message.issue.last_action_id =
        sessionData.last_action || "AL2";
      break;

    case "on_issue_need_more_info":
      existingPayload.message.issue.status = "NEED_MORE_INFO";
      existingPayload.message.issue.last_action_id =
        sessionData.last_action || "AL3";
      break;

    case "on_issue_info_provided":
      existingPayload.message.issue.status = "INFO_PROVIDED";
      existingPayload.message.issue.last_action_id =
        sessionData.last_action || "AL5";
      break;

    case "on_issue_resolution":
      existingPayload.message.issue.status = "RESOLVED";
      existingPayload.message.issue.last_action_id =
        sessionData.last_action || "AL6";

      const resolutions = existingPayload.message.issue.resolutions;
      resolutions.forEach((r: any) => {
        r.updated_at = newDate;
        if (r.tags) {
          r.tags.forEach((tag: any) => {
            tag.list.forEach((entry: any) => {
              if (entry.descriptor.code === "ITEM") {
                entry.value = sessionData.items[0].id;
              }
              if (entry.descriptor.code === "REFUND_AMOUNT") {
                entry.value = "2260";
              }
            });
          });
        }
        return r;
      });
      break;

    case "on_issue_resolved":
      existingPayload.message.issue.resolutions = sessionData.issue_resolution;
      let sessionActions = sessionData.issue_action;
      const issueActionAccept: any = sessionActions[sessionActions.length - 1];
      const refId = issueActionAccept?.ref_id;
      let updatedAction = {
        id: "A8",
        ref_id: "R2",
        ref_type: "RESOLUTIONS",
        descriptor: {
          code: "RESOLVED",
          name: "REPLACEMENT",
          short_desc: "Providing replacement",
        },
        updated_at: newDate,
        action_by: "NP2",
        actor_details: {
          name: "mock-person",
        },
      };
      if (refId == "R1") {
        updatedAction = {
          id: "A8",
          ref_id: "R1",
          ref_type: "RESOLUTIONS",
          descriptor: {
            code: "RESOLVED",
            name: "REFUND",
            short_desc: "Providing refund",
          },
          updated_at: newDate,
          action_by: "NP2",
          actor_details: {
            name: "mock-person",
          },
        };
      }
      const actions = existingPayload.message.issue.actions;
      actions[actions.length - 1] = updatedAction;
      break;

    default:
      // no action
      break;
  }

  let actions = existingPayload.message.issue.actions;
  actions[actions.length - 1].updated_at = newDate;

  const updatedAction = actions[actions.length - 1];
  console.log("sessionData.issue_action", sessionData.issue_action);
  if (sessionData.issue_action.length > 0) {
    console.log("sessionData.issue_action", sessionData.issue_action);
    let sessionDataActions = sessionData.issue_action;
    sessionDataActions.push(updatedAction);
    existingPayload.message.issue.actions = sessionDataActions;
  }

  return existingPayload;
};
