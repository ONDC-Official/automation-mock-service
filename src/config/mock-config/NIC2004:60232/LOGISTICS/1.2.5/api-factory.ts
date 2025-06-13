import { searchGenerator } from "./search/generator";
import { initGenerator } from "./init/generator";
import { confirmGenerator } from "./confirm/generator";
import { updateGenerator } from "./update/generator";
import { trackGenerator } from "./track/generator";
import { onSearch1Generator } from "./on_search/generator";
import { onInitGenerator } from "./on_init/generator";
import { onConfirmGenerator } from "./on_confirm/generator";
import { onUpdateGenerator } from "./on_update/generator";
import { cancelGenerator } from "./cancel/generator";
import { onStatusGenerator } from "./on_status/generator";
import { onTrackGenerator } from "./on_track/generator";
import { onCancelGenerator } from "./on_cancel/generators";
import { statusGenerator } from "./status/generator";
import { onUpdate1Generator } from "./on_update/on_update_1/generator";
import { issueStatusGenerator } from "./issue/generator";
import { onIssueStatusGenerator } from "./on_issue/generator";


export async function Generator(
  action_id: string,
  existingPayload: any,
  sessionData: any,
  inputs?: Record<string, string>
) {
  console.log("inside generator");

  switch (action_id) {
    case "search_LOGISTICS":
      return await searchGenerator(existingPayload, sessionData, inputs);
    case "search_1_LOGISITCS":
      return await searchGenerator(existingPayload, sessionData, inputs);
    case "search_2_LOGISTICS":
      return await searchGenerator(existingPayload, sessionData, inputs);
    case "search_3_LOGISTICS":
      return await searchGenerator(existingPayload, sessionData, inputs);
    case "init_LOGISTICS":
      return await initGenerator(existingPayload, sessionData);
    case "confirm_LOGISTICS":
      return await confirmGenerator(existingPayload, sessionData, inputs);
    case "update_LOGISTICS":
      return await updateGenerator(existingPayload, sessionData);
    case "track_LOGISTICS":
      return await trackGenerator(existingPayload, sessionData);
    case "cancel_LOGISTICS":
      return await cancelGenerator(existingPayload, sessionData);
    case "on_search_LOGISTICS":
      return await onSearch1Generator(existingPayload, sessionData, inputs);
    case "on_init_LOGISTICS":
      return await onInitGenerator(existingPayload, sessionData);
    case "on_confirm_LOGISTICS":
      return await onConfirmGenerator(existingPayload, sessionData);
    case "on_update_LOGISTICS":
      return await onUpdateGenerator(existingPayload, sessionData);
    case "on_status_LOGISTICS":
      return await onStatusGenerator(existingPayload, sessionData);
    case "on_status_1_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Order-picked-up",
      });
    case "on_status_2_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Out-for-delivery",
      });
    case "on_status_3_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Order-delivered",
      });
    case "on_status_4_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "RTO-Delivered",
      });
    case "on_status_5_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "At-pickup",
      });
    case "on_status_6_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "At-destination-hub",
      });
    case "on_status_7_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "In-transit",
      });
    case "on_status_8_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Pickup-rescheduled",
      });
    case "on_status_9_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Out-for-pickup",
      });
    case "on_status_10_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Delivery-rescheduled",
      });
    case "on_status_11_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Agent-assigned",
      });
    case "on_status_12_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "At-delivery",
      });
    case "on_status_13_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Agent-assigned",
      });
    case "on_track_LOGISTICS":
      return await onTrackGenerator(existingPayload, sessionData);
    case "on_cancel_LOGISTICS":
      return await onCancelGenerator(existingPayload, sessionData);
    case "status_LOGISTICS":
      return await statusGenerator(existingPayload, sessionData);
    case "on_update_1_LOGISTICS":
      return await onUpdate1Generator(existingPayload, sessionData);
    case "issue_processing":
      return await issueStatusGenerator(existingPayload,{
        ...sessionData,
        igm_action: "issue_processing"
      }); 
    case "issue_open":
      return await issueStatusGenerator(existingPayload,{
        ...sessionData,
        igm_action: "issue_open"
      });
    case "issue_close":
      return await issueStatusGenerator(existingPayload,{
        ...sessionData,
        igm_action: "issue_close"
      });
    case "on_issue_processing":
      return await onIssueStatusGenerator(existingPayload,{
        ...sessionData,
        igm_action: "on_issue_processing"
      });
    case "issue_resolution_accept":
      console.log("------- LLALALALALLAALALALLALA AXasljfasldfjslkdfjasldkfjsldfjsaldf RUPAL --------- ");
      return await issueStatusGenerator(existingPayload,{
        ...sessionData,
        igm_action: "issue_resolution_accept"
      });
    case "issue_resolution":  
      return await issueStatusGenerator(existingPayload,{
        ...sessionData,
        igm_action: "issue_resolution"
      });

    case "on_issue_need_more_info":
      return await onIssueStatusGenerator(existingPayload,{
        ...sessionData,
        igm_action: "on_issue_need_more_info"
      });
    case "issue_info_provided":
      return await issueStatusGenerator(existingPayload,{
        ...sessionData,
        igm_action: "issue_info_provided"
      });  
    case  "on_issue_provided":
      return await onIssueStatusGenerator(existingPayload,{
        ...sessionData,
        igm_action: "on_issue_provided"
      });  
    case "on_issue_resolution":
      return await onIssueStatusGenerator(existingPayload,{
        ...sessionData,
        igm_action: "on_issue_resolution"
      });  
    case "on_issue_resolved":
      return await onIssueStatusGenerator(existingPayload,{
        ...sessionData,
        igm_action: "on_issue_resolved"
      });
      case "on_update_IGM":
        return await onUpdate1Generator(existingPayload, sessionData);

      
    

    default:
      throw new Error(`Invalid request type ${action_id}`);
  }
}
