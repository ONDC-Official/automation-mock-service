export type SessionData = {
  mock_type: string | undefined;
  usecaseId: string | undefined;
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
  user_inputs: Input | undefined;
  inc_mode: string | undefined;
  selected_items: any | undefined;
  selected_fulfillments: any | undefined;
  provider: any | undefined;
  fulfillments: any | undefined;
  billing: any | undefined;
  items: any | undefined;
  quote: any | undefined;
  order_id: string | undefined;
  payment: any | undefined;
  order_state: string | undefined;
  last_action: string | undefined;
  city_code: string | undefined;
  shipment_method?: any;
  domain?: string;
  out_of_stock_item_ids?: any;
  on_status_fulfillments?: any;
  on_select_fulfillments?: any;
  bpp_terms?: any;
  order_created_at?: any;
  last_updated_at?: string;
  bap_terms?: any;
  // order phase
  selected_item_id: string;
  end: any[];
  bnp_features: any[];
  item_availability_enabled?: boolean;
  item_timing?: any;
  customizations?: any;
  on_search_items?: any[];
  select_fulfillment?: any[];
  confirm_created_at_timestamp?: string;
  on_confirm_updated_at_timestamp?: string;
  on_status_updated_at?: string;
  cancellation_reason_id?: string;
  cancellation?: any;
  stateCode?: string;
  np_type?: string;
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
  CancelInputType: {
    cancellation_reason_id?: string;
  };
}
