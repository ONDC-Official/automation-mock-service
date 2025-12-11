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
import { searchQCGenerator } from "./search/search_qc/generator";
import { onSearchQCGenerator } from "./on_search/on_search_qc/generator";
import { initQCGenerator } from "./init/init_qc/generator";
import { onInitQCGenerator } from "./on_init/on_init_qc/generator";
import { confirmQCGenerator } from "./confirm/confirm_qc/generator";
import { onConfirmQCGenerator } from "./on_confirm/on_confirm_qc/generator";
import { updateQCGenerator } from "./update/update_qc/generator";
import { onUpdateQCGenerator } from "./on_update/on_update_qc/generator";
import { onSearchCodifiedGenerator } from "./on_search/on_search_codified/generator";
import { onConfirmCodifiedGenerator } from "./on_confirm/on_confirm_codified/generator";
import { searchRateCardP2PGenerator } from "./search/search_rate_card_P2P/generator";
import { onSearchRateCardP2PGenerator } from "./on_search/on_search_rate_card_P2P/generator"
import { searchRateCardP2H2PGenerator } from "./search/search_rate_card_P2H2P/generator";
import { onSearchRateCardP2H2PGenerator } from "./on_search/on_search_rate_card_P2H2P/generator";
// import { onUpdateIgmReplacementGenerator } from "./on_update/on_update_replacement_igm/generator";
// import { onUpdateIgmReturnGenerator } from "./on_update/on_update_return_igm/generator";
export async function Generator(
  action_id: string,
  existingPayload: any,
  sessionData: any,
  inputs?: Record<string, string>
) {
  console.log("inside generator", action_id);

  switch (action_id) {
    case "search_LOGISTICS":
      return await searchGenerator(existingPayload, sessionData, inputs,action_id);
    case "search_qc":
      return await searchQCGenerator(existingPayload, sessionData, inputs);
    case "search_1_LOGISITCS":
      return await searchGenerator(existingPayload, sessionData, inputs,action_id);
    case "search_2_LOGISTICS":
      return await searchGenerator(existingPayload, sessionData, inputs,action_id);
    case "search_3_LOGISTICS":
      return await searchGenerator(existingPayload, sessionData, inputs,action_id);
    case "search_rate_card_P2P_LOGISTICS":
      return await searchRateCardP2PGenerator(existingPayload, sessionData, inputs,action_id);
    case "search_rate_card_P2H2P_LOGISTICS":
      return await searchRateCardP2H2PGenerator(existingPayload, sessionData, inputs,action_id);
    case "search_REVERSE_QC_LOGISTICS":
      return await searchGenerator(existingPayload, sessionData, inputs,action_id);
    case "init_LOGISTICS":
      return await initGenerator(existingPayload, sessionData,inputs,action_id);
    case "call_masking_init_LOGISTICS":
      return await initGenerator(existingPayload, sessionData,inputs,action_id);
    case "init_qc":
      return await initQCGenerator(existingPayload, sessionData);
    case "init_REVERSE_QC_LOGISTICS":
      return await initGenerator(existingPayload, sessionData,inputs,action_id);
    case "confirm_LOGISTICS":
      return await confirmGenerator(existingPayload, sessionData, inputs,action_id);
    case "confirm_REVERSE_QC_LOGISTICS":
      return await confirmGenerator(existingPayload, sessionData, inputs,action_id);
    case "confirm_SELLER_BUYER_INSTRUCTIONS":
      return await confirmGenerator(existingPayload, sessionData, inputs,action_id);
    case "confirm_E_WAY_BILL_LOGISTICS":
      return await confirmGenerator(existingPayload, sessionData, inputs,action_id);
    case "update_LOGISTICS":
      return await updateGenerator(existingPayload, sessionData,inputs,action_id);
    case "update_DELIVERY_ADDRESS":
      return await updateGenerator(existingPayload,sessionData,inputs,action_id);
    case "update_E_WAY_BILL_LOGISTICS" :
      return await updateGenerator(existingPayload,sessionData,inputs,action_id);
    case "update_E_POD_LOGISTICS": 
      return await updateGenerator(existingPayload,sessionData,inputs,action_id);
    case "track_LOGISTICS":
      return await trackGenerator(existingPayload, sessionData);
    case "cancel_LOGISTICS":
      return await cancelGenerator(existingPayload, sessionData,inputs,action_id);
    case "buyer_side_cancel_LOGISTICS":
      return await cancelGenerator(existingPayload, sessionData,inputs,action_id);
    case "on_search_qc":
      return await onSearchQCGenerator(existingPayload, sessionData, inputs);
    case "on_search_LOGISTICS":
      return await onSearch1Generator(existingPayload, sessionData,action_id,inputs);
    case "on_search_rate_card_P2P_LOGISTICS":
      return await onSearchRateCardP2PGenerator(existingPayload,sessionData,action_id,inputs)
    case "on_search_rate_card_P2H2P_LOGISTICS":
      return await onSearchRateCardP2H2PGenerator(existingPayload,sessionData,action_id,inputs)
    case "on_search_REVERSE_QC_LOGISTICS":
      return await onSearch1Generator(existingPayload,sessionData,action_id,inputs)
    case "on_init_LOGISTICS":
      return await onInitGenerator(existingPayload, sessionData);
    case "on_init_qc":
      return await onInitQCGenerator(existingPayload, sessionData);
    case "on_init_REVERSE_QC_LOGISTICS":
      return await onInitGenerator(existingPayload,sessionData)
    case "confirm_qc":
      return await confirmQCGenerator(existingPayload, sessionData, inputs);
    case "on_confirm_qc":
      return await onConfirmQCGenerator(existingPayload, sessionData);
    case "on_confirm_LOGISTICS":
      return await onConfirmGenerator(existingPayload, sessionData,action_id);
      case "on_confirm_REVERSE_QC_LOGISTICS":
      return await onConfirmGenerator(existingPayload, sessionData,action_id);
    case "on_update_LOGISTICS":
      return await onUpdateGenerator(existingPayload, sessionData,action_id);
    case "on_update_DELIVERY_ADDRESS":
      return await onUpdateGenerator(existingPayload, sessionData,action_id);
    case "on_update_E_WAY_BILL_LOGISTICS":
      return await onUpdateGenerator(existingPayload, sessionData,action_id);
    case "on_update_E_POD_AT_PICKUP_LOGISTICS":
      return await onUpdateGenerator(existingPayload, sessionData,action_id);
     case "on_update_E_POD_AT_DELIVERY_LOGISTICS":
      return await onUpdateGenerator(existingPayload, sessionData,action_id);
    case "update_qc":
      return await updateQCGenerator(existingPayload, sessionData);
    case "on_update_qc":
      return await onUpdateQCGenerator(existingPayload, sessionData);
    case "static_otp_update_LOGISTICS":
       return await updateGenerator(existingPayload,sessionData,inputs,action_id)
    case "on_status_LOGISTICS":
      return await onStatusGenerator(existingPayload,sessionData,action_id);
    case "on_status_1_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Order-picked-up",
      },
      action_id
      );
    case "on_status_REVERSE_QC_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Order-picked-up",
      },
      action_id
      );
    case "on_status_2_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Out-for-delivery",
      },
      action_id
    );
    case "on_status_3_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Order-delivered",
      },
      action_id
    );
    case "on_status_4_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "RTO-Delivered",
      },
      action_id
    );
    case "on_status_5_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "At-pickup",
      },
      action_id
    );
    case "on_status_6_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "At-destination-hub",
      },
      action_id
    );
    case "on_status_7_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "In-transit",
      },
      action_id
    );
    case "on_status_8_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Pickup-rescheduled",
      },
      action_id
    );
    case "on_status_9_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Out-for-pickup",
      },
      action_id
    );
    case "on_status_10_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Delivery-rescheduled",
      },
      action_id
    );
    case "on_status_11_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Agent-assigned",
      },
      action_id
    );
    case "on_status_12_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "At-delivery",
      },
      action_id
    );
    case "on_status_13_LOGISTICS":
      return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Agent-assigned",
      },
      action_id
    );
    case "on_track_LOGISTICS":
      return await onTrackGenerator(existingPayload, sessionData);
    case "on_cancel_LOGISTICS":
      return await onCancelGenerator(existingPayload, sessionData,inputs,action_id);
    case "seller_side_on_cancel_LOGISTICS":
      return await onCancelGenerator(existingPayload, sessionData,inputs,action_id);
    case "status_LOGISTICS":
      return await statusGenerator(existingPayload, sessionData);
    case "on_update_1_LOGISTICS":
      return await onUpdate1Generator(existingPayload, sessionData);
    // case "issue_processing":
    //   return await issueStatusGenerator(existingPayload, {
    //     ...sessionData,
    //     igm_action: "issue_processing",
    //   });
    // case "issue_open":
    //   return await issueStatusGenerator(existingPayload, {
    //     ...sessionData,
    //     igm_action: "issue_open",
    //   });
    // case "issue_close":
    //   return await issueStatusGenerator(existingPayload, {
    //     ...sessionData,
    //     igm_action: "issue_close",
    //   });
    // case "on_issue_processing":
    //   return await onIssueStatusGenerator(existingPayload, {
    //     ...sessionData,
    //     igm_action: "on_issue_processing",
    //   });
    // case "issue_resolution_accept":
    //   return await issueStatusGenerator(existingPayload, {
    //     ...sessionData,
    //     igm_action: "issue_resolution_accept",
    //   });
    // case "issue_resolution":
    //   return await issueStatusGenerator(existingPayload, {
    //     ...sessionData,
    //     igm_action: "issue_resolution",
    //   });

    // case "on_issue_need_more_info":
    //   return await onIssueStatusGenerator(existingPayload, {
    //     ...sessionData,
    //     igm_action: "on_issue_need_more_info",
    //   });
    // case "issue_info_provided":
    //   return await issueStatusGenerator(existingPayload, {
    //     ...sessionData,
    //     igm_action: "issue_info_provided",
    //   });
    // case "on_issue_provided":
    //   return await onIssueStatusGenerator(existingPayload, {
    //     ...sessionData,
    //     igm_action: "on_issue_provided",
    //   });
    // case "on_issue_resolution":
    //   return await onIssueStatusGenerator(existingPayload, {
    //     ...sessionData,
    //     igm_action: "on_issue_resolution",
    //   });
    // case "on_issue_resolved":
    //   return await onIssueStatusGenerator(existingPayload, {
    //     ...sessionData,
    //     igm_action: "on_issue_resolved",
    //   });
    // case "on_update_IGM":
    //   return await onUpdate1Generator(existingPayload, sessionData);

    case "issue_open":
      return await issueStatusGenerator(existingPayload, {
        ...sessionData,
        igm_action: "issue_open",
      }, inputs);
    case "issue_escalate":
      return await issueStatusGenerator(existingPayload, {
        ...sessionData,
        igm_action: "issue_escalate",
      }, inputs);  
    case "issue_open_2":
      return await issueStatusGenerator(existingPayload, {
        ...sessionData,
        igm_action: "issue_open_2",
      }, inputs);
		case "on_issue_processing":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_processing",
			});
    case "on_issue_processing_1":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_processing_1",
			});
    case "on_issue_processing_2":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_processing_2",
			});    
		case "on_issue_need_more_info":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_need_more_info",
			});
    case "issue_info_provided":
      return await issueStatusGenerator(existingPayload, {
        ...sessionData,
        igm_action: "issue_info_provided",
      }, inputs);
		case "on_issue_provided":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_provided",
			});
		case "on_issue_resolution":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_resolution",
			});
    case "on_issue_resolution_1":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_resolution_1",
			});
    case "on_issue_resolution_2":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_resolution_2",
			});  
    case "on_issue_resolution_igm_3":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_resolution_igm_3",
			});     
		case "issue_resolution_accept":
			return await issueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "issue_resolution_accept",
			}, inputs);
    case "issue_resolution_accept_igm_3":
			return await issueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "issue_resolution_accept_igm_3",
			}, inputs);  
    case "issue_resolution_reject":
			return await issueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "issue_resolution_reject",
			}, inputs);  
		case "on_issue_resolved":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_resolved",
			}, inputs);
    case "on_issue_resolved_igm_3":
			return await onIssueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "on_issue_resolved_igm_3",
			}, inputs);  
		case "issue_close":
			return await issueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "issue_close",
			}, inputs)
    case "issue_close_igm_3":
			return await issueStatusGenerator(existingPayload, {
				...sessionData,
				igm_action: "issue_close_igm_3",
			}, inputs)  
    case "on_update_refund_igm": 
			return await onUpdateGenerator(
        existingPayload,
        sessionData,
        action_id,
      ); 
    case "on_status_igm_3":
			return await onStatusGenerator(existingPayload, {
        ...sessionData,
        stateCode: "Order-delivered",
      },
      action_id
    ); 
    case "confirm_LOGISTICS_EXCHANGE":
      return await confirmGenerator(
        existingPayload,
        sessionData,
        inputs,
        action_id
      );
    case "on_confirm_LOGISTICS_EXCHANGE":
      return await onConfirmGenerator(existingPayload, sessionData,action_id);
    case "on_search_LOGISTICS_CODIFIED":
      return await onSearchCodifiedGenerator(
        existingPayload,
        sessionData,
        inputs
      );
    case "on_confirm_LOGISTICS_CODIFIED":
      return await onConfirmCodifiedGenerator(existingPayload, sessionData);
    case "on_search_LOGISTICS_RCM":
      return await onSearch1Generator(existingPayload, sessionData,action_id,inputs);
    case "on_confirm_LOGISTICS_RCM":
      return await onConfirmGenerator(existingPayload, sessionData,action_id);
    case "on_search_LOGISTICS_PUBLIC_SPECIAL":
      return await onSearch1Generator(
        existingPayload,
        sessionData,
        action_id,
        inputs
      );
    case "search_LOGISTICS_SLA":
      return await searchGenerator(existingPayload, sessionData, inputs,action_id);
    case "confirm_LOGISTICS_SLA":
      return await confirmGenerator(existingPayload, sessionData, inputs,action_id);
    case "on_confirm_LOGISTICS_SLA":
      return await onConfirmGenerator(existingPayload, sessionData,action_id);
    case "confirm_LOGISTICS_SELLER_CREDS":
      return await confirmGenerator(
        existingPayload,
        sessionData,
        inputs,
        action_id
      );
    default:
      throw new Error(`Invalid request type ${action_id}`);
  }
}

