import { Input, SessionData } from "../../../session-types";
import { action, getActionsList } from "../default";

export const onIssueStatusGenerator = async (
  existingPayload: any,
  sessionData: SessionData,
  inputs?: Input
) => {
  const newDate = existingPayload.context.timestamp;
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
      existingPayload.message.issue.actors = [
        ...sessionData.latest_issue_payload?.actors,
        {
          id: "NP2",
          type: "COUNTERPARTY_NP",
          info: {
            org: {
              name: `${existingPayload?.context?.bpp_id}::${existingPayload?.context?.domain}`,
            },
            contact: {
              phone: "9999994039",
              email: "sellerapp@interface.com",
            },
            person: {
              name: "Jane Doe",
            },
          },
        },
      ];
      existingPayload.message.issue.descriptor.short_desc =
        "Issue with product quality";
      existingPayload.message.issue.actions = getActionsList(
        {
          id: "A2",
          descriptor: {
            code: "PROCESSING",
            short_desc: "Complaint created",
          },
          updated_at: "2025-11-04T11:37:59.928Z",
          action_by: "NP2",
          actor_details: {
            name: "mock-person",
          },
        },
        newDate,
        "on_issue_processing"
      );
      existingPayload.message.issue.last_action_id =
        action[action.length - 1]?.id ?? "A22";
      // existingPayload.message.issue.last_action_id =
      //   sessionData.last_actions_id[sessionData.last_actions_id - 1]?.id ||
      //   "A2";
      // existingPayload.message.issue.actors = [
      //   ...existingPayload.message.issue.actors,
      //   {
      //     id: "NP2",
      //     type: "COUNTERPARTY_NP",
      //     info: {
      //       org: {
      //         name: `${existingPayload?.context?.bpp_id ?? ""}::${
      //           existingPayload?.context?.domain ?? ""
      //         }`,
      //       },
      //       contact: {
      //         phone: "9450394140",
      //         email: "respondentapp@respond.com",
      //       },
      //       person: {
      //         name: "Jane Doe",
      //       },
      //     },
      //   },
      // ];
      break;

    case "on_issue_need_more_info":
      existingPayload.message.issue.status = "PROCESSING";
      existingPayload.message.issue.actions = getActionsList(
        {
          id: "A3",
          descriptor: {
            code: "INFO_REQUESTED",
            name: "INFO01",
            short_desc: "Please provide product image",
          },
          updated_at: "2025-11-04T11:38:02.643Z",
          action_by: "NP2",
          actor_details: {
            name: "mock-person",
          },
        },
        newDate,
        "on_issue_need_more_info"
      );
      existingPayload.message.issue.last_action_id =
        action[action.length - 1]?.id ?? "A22";
      // existingPayload.message.issue.last_action_id =
      //   sessionData.last_actions_id[sessionData.last_actions_id - 1]?.id ||
      //   "A3";
      break;

    case "on_issue_provided":
      existingPayload.message.issue.status = "PROCESSING";
      // existingPayload.message.issue.last_action_id =
      //   sessionData.last_actions_id[sessionData.last_actions_id - 1]?.id ||
      //   "A5";
      existingPayload.message.issue.actions = getActionsList(
        {
          id: "A5",
          descriptor: {
            code: "PROCESSING",
            short_desc: "Complaint created",
          },
          updated_at: "2025-11-04T11:38:06.745Z",
          action_by: "NP2",
          actor_details: {
            name: "mock-person",
          },
        },
        newDate,
        "on_issue_provided"
      );
      existingPayload.message.issue.last_action_id =
        action[action.length - 1]?.id ?? "A22";

      console.log(
        "🚀 ~ onIssueStatusGenerator ~ on_issue_info_provided:",
        JSON.stringify(existingPayload)
      );
      break;

    case "on_issue_resolution":
      existingPayload.message.issue.status = "PROCESSING";
      existingPayload.message.issue.actors = [
        ...sessionData.latest_issue_payload?.actors,
        {
          id: "NP2-GRO",
          type: "COUNTERPARTY_NP_GRO",
          info: {
            org: {
              name: `${existingPayload?.context?.bpp_id}::${existingPayload?.context?.domain}`,
            },
            contact: {
              phone: "9999994039",
              email: "sellerapp@interface.com",
            },
            person: {
              name: "Grievance Officer BNP",
            },
          },
        },
      ];
      // existingPayload.message.issue.last_action_id =
      //   sessionData.last_actions_id[sessionData.last_actions_id - 1]?.id ||
      //   "A6";
      existingPayload.message.issue.actions = getActionsList(
        {
          id: "A6",
          ref_id: "R_PARENT",
          ref_type: "RESOLUTIONS",
          descriptor: {
            code: "RESOLUTION_PROPOSED",
            short_desc: "Resolution is proposed",
          },
          updated_at: "2025-11-04T11:49:25.358Z",
          action_by: "NP2",
          actor_details: {
            name: "mock-person",
          },
        },
        newDate,
        "on_issue_resolution"
      );
      existingPayload.message.issue.last_action_id =
        action[action.length - 1]?.id ?? "A22";

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
      existingPayload.message.issue.status = "RESOLVED";
      existingPayload.message.issue.resolutions = sessionData.issue_resolution;
      let sessionActions = sessionData.issue_action;
      const issueActionAccept: any = sessionActions[sessionActions.length - 1];
      const refId = issueActionAccept?.ref_id;
      existingPayload.message.issue.actions = getActionsList(
        refId === "R1"
          ? {
              id: "A8-9",
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
            }
          : {
              id: "A8-8",
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
            },
        newDate,
        "on_issue_resolved"
      );
      existingPayload.message.issue.last_action_id =
        action[action.length - 1]?.id ?? "A22";
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
