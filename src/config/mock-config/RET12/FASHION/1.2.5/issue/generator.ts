import { SessionData } from "../../../session-types";

export const issueStatusGenerator = async (
  existingPayload: any,
  sessionData: SessionData
) => {
  console.log("existingPayload", JSON.stringify(existingPayload));
  const newDate = existingPayload.context.timestamp
  existingPayload.message.issue.id =
    sessionData.latest_issue_payload?.id || "ISSUE-1";
  existingPayload.message.issue.created_at =
    sessionData.latest_issue_payload?.created_at || newDate;
  existingPayload.message.issue.updated_at = newDate;
  existingPayload.message.issue.expected_response_time = sessionData
    .latest_issue_payload?.expected_response_time || { duration: "PT2H" };
  existingPayload.message.issue.expected_resolution_time = sessionData
    .latest_issue_payload?.expected_resolution_time || { duration: "P1D" };

  const provider = sessionData.provider_id;
  let fulfillment = "F1";
  if (sessionData.fulfillments) {
    fulfillment = sessionData.fulfillments[0].id;
  }
  const item = sessionData.items[0].id;
  const order = sessionData.order_id;
  const refs = [
    {
      ref_id: order,
      ref_type: "ORDER",
    },
    {
      ref_id: provider,
      ref_type: "PROVIDER",
    },
    {
      ref_id: fulfillment,
      ref_type: "FULFILLMENT",
    },
    {
      ref_id: item,
      ref_type: "ITEM",
      tags: [
        {
          descriptor: {
            code: "message.order.items",
          },
          list: [
            {
              descriptor: {
                code: "quantity.selected.count",
              },
              value: "1",
            },
          ],
        },
      ],
    },
  ];
  existingPayload.message.issue.refs =
    sessionData.latest_issue_payload?.refs || refs;
  existingPayload.message.issue.actors =
    sessionData.latest_issue_payload?.actors ||
    existingPayload.message.issue.actors;
  existingPayload.message.issue.source_id =
    sessionData.latest_issue_payload?.source_id ||
    existingPayload.message.issue.source_id;
  existingPayload.message.issue.complainant_id =
    sessionData.latest_issue_payload?.complainant_id || "NP1";
  existingPayload.message.issue.descriptor.code =
    sessionData.latest_issue_payload?.descriptor?.code || "ITM004";
  existingPayload.message.issue.descriptor.short_desc =
    sessionData.latest_issue_payload?.descriptor?.short_desc ||
    "Issue with product quality";
  existingPayload.message.issue.descriptor.long_desc =
    sessionData.latest_issue_payload?.descriptor?.long_desc ||
    "Product quality is not correct. facing issues while using the product";
  existingPayload.message.issue.descriptor.additional_desc.url =
    sessionData.latest_issue_payload?.additional_desc?.url ||
    "https://example.com/issue-details";
  existingPayload.message.issue.descriptor.additional_desc.content_type =
    sessionData.latest_issue_payload?.additional_desc?.content_type ||
    "text/html";
  existingPayload.message.issue.descriptor.images.url =
    sessionData.latest_issue_payload?.descriptor?.image?.url ||
    "https://example.com/image.jpg";
  sessionData.latest_issue_payload?.descriptor?.images || [
    {
      url: "https://example.com/image.jpg",
      size_type: "2MB",
    },
  ];
  existingPayload.message.issue.descriptor.media.url =
    sessionData.latest_issue_payload?.descriptor?.media?.url ||
    "https://example.com/media.mp4";
  existingPayload.message.issue.last_action_id =
    sessionData.last_action || "on_status";

  // Update status and descriptors
  existingPayload.message.issue.status = sessionData.status || "OPEN";
  switch (sessionData.igm_action) {
    case "issue_open":
      existingPayload.message.issue.status = "OPEN";
      existingPayload.message.issue.descriptor.short_desc =
        "Issue with product quality";
      existingPayload.message.issue.last_action_id =
        sessionData.last_action || "A1";
      break;

    case "issue_open_2":
        existingPayload.message.issue.descriptor.code = "PMT002";
      existingPayload.message.issue.status = "OPEN";
      existingPayload.message.issue.descriptor.short_desc =
        "The actual payout made is less than expected";
      existingPayload.message.issue.last_action_id =
        sessionData.last_action || "A1";
      break;

    case "issue_info_provided":
      existingPayload.message.issue.status = "INFO_PROVIDED";
      existingPayload.message.issue.last_action_id =
        sessionData.last_action || "A4";
      break;

    case "issue_resolution_accept":
      existingPayload.message.issue.status = "PROCESSING";
      existingPayload.message.issue.last_action_id =
        sessionData.last_action || "A7";
      existingPayload.message.issue.resolutions = sessionData.issue_resolution;
      console.log("issue_resolution_accept");
      let input: any = sessionData.user_inputs;
      const resolution_accept = input?.resolution_accept || "R2-Replacement";
      console.log("input", input);
      const refId = resolution_accept.split("-");
      console.log("refId", refId)
      let actions = existingPayload.message.issue.actions;
      actions[actions.length - 1].ref_id = refId[0];
      break;

    case "issue_close":
      existingPayload.message.issue.status = "CLOSED";
      existingPayload.message.issue.last_action_id =
        sessionData.last_action || "A8";
      existingPayload.message.issue.resolutions = sessionData.issue_resolution;
      break;

    default:
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

  const { start, end } = sessionData.fulfillments[0];

  const extractedFulfillmentData = {
    start: {
      person: { name: start.location.descriptor.name || "Mock Buyer" },
      contact: start.contact || {
        phone: "9450394039",
        email: "buyer@gmail.com",
      },
    },
    end: {
      person: end.person || { name: "Mock Consumer" },
      contact: end.contact || {
        phone: "9879879870",
        email: "consumer@gmail.com",
      },
    },
  };

  existingPayload.message.issue.actors.forEach((actor: any) => {
    actor.info.org.name = `${existingPayload.context.bap_id}::${existingPayload.context.domain}`;
    switch (actor.type) {
      case "CONSUMER":
        actor.info.person = extractedFulfillmentData.end.person;
        actor.info.contact = extractedFulfillmentData.end.contact;
        break;
      case "INTERFACING_NP":
        actor.info.person = extractedFulfillmentData.start.person;
        actor.info.contact = extractedFulfillmentData.start.contact;
      default:
        break;
    }
  });

  return existingPayload;
};
