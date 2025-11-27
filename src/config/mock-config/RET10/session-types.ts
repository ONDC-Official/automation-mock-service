import { Fulfillments } from "./GROCERY/1.2.5/api-objects/fulfillments";

export type SessionData = {
  mock_type: string | undefined;
  usecaseId: string | undefined;
  protocol_session_id: string | undefined;
  subscriber_url: string | undefined;
  transaction_id: string | undefined;
  message_id: string | undefined;
  bap_id: string | undefined;
  bap_uri: string | undefined;
  bpp_id: string | undefined;
  bpp_uri: string | undefined;
  city: string | undefined;
  error_code: string | undefined;
  error_message: string | undefined;
  order: any | undefined;
  order_id: string | undefined;
  order_state: string | undefined;
  order_items: any;
  order_tags: any;
  order_created_at?: any;
  user_inputs: Input | undefined;
  inc_mode: string | undefined;
  selected_items: any | undefined;
  selected_item_id: string;
  selected_fulfillments: any | undefined;
  selected_offers?: any | undefined;
  selected_np_fees?: any | undefined;
  provider: any | undefined;
  provider_id: any;
  fulfillments: any | undefined;
  update_fulfillments?: any;
  on_status_fulfillments?: any;
  on_select_fulfillments?: any;
  on_select_items?: any | undefined;
  items: any | undefined;
  quote: any | undefined;
  billing: any | undefined;
  payment: any | undefined;
  update_payment: any;
  city_code: string | undefined;
  domain?: string;
  shipment_method?: any;
  out_of_stock_item_ids?: any; // original kept
  cancellation_reason_id?: string;
  cancellation_return_reason_id?: string;
  cancellation?: any;
  bpp_terms?: any;
  bap_terms?: any;
  tags?: any | undefined;
  search_bap_terms?: any;
  tat: any;
  status: any;
  last_action: string | undefined;
  last_updated_at?: string;
  confirm_created_at_timestamp?: string;
  on_confirm_updated_at_timestamp?: string;
  on_status_updated_at?: string;
  item_availability_enabled?: boolean;
  item_timing?: any;
  customizations?: any;
  on_search_items?: any[];
  select_fulfillment?: any[];
  bnp_features: any[];
  end: any[];
  igm_action: any;
  issue_action: any[];
  issue_resolution: any;
  latest_issue_payload: any;
  issue_id: any;
  replacementId?: string;
  np_type?: string;
  stateCode?: string;
  issue_level: any
};

export type BecknContext = {
    action: string;
    bap_id: string;
    bap_uri: string;
    bpp_id?: string;
    bpp_uri?: string;
    domain: string;
    country: string;
    city: string;
    message_id: string;
    timestamp: string;
    transaction_id: string;
    core_version: string;
    ttl: string;
};

export interface Input {
  category?: string;
  paymentType?: string;
  city_code?: string;
  start_gps?: string;
  end_gps?: string;
  start_code?: string;
  end_code?: string;
  feature_discovery?: string[];
  fulfillRequest?: string;
  retailCategory?: string;
  returnToOrigin?: string;
  default_feature?: string[];
  SelectInputType?: {
    provider?: string;
    provider_location?: string[];
    location_gps?: string;
    location_pin_code?: string;
    items?: {
      itemId?: string;
      quantity?: number;
      location?: string;
    }[];
  };
  np_fees: any,
  CancelInputType: {
    cancellation_reason_id?: string;
  };
  resolution_accept: any
  rating: string
}