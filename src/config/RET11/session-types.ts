export interface ItemTiming {
  day_from?: string;
  day_to?: string;
  time_from?: string;
  time_to?: string;
  timestamp?: string;
}
export interface SessionData {
  subscriber_url: string | undefined;
  transaction_id: string | undefined;
  message_id: string | undefined;
  last_action: string | undefined;
  mock_type: string | undefined;
  city_code: string | undefined;
  usecaseId?: string;
  bap_id: string | undefined;
  bap_uri: string | undefined;
  bpp_id: string | undefined;
  bpp_uri: string | undefined;
  shipment_method?: any;
  error_code?: string;
  error_message?: string;
  domain?: string;
  fulfillments: any[];
  selected_items: any[];
	selected_item_id: string;
  quote: any;
  items: any[];
  billing: Record<string, any>;
  payment: any[];
  end: any[];
  bnp_features: any[];
  item_availability_enabled?: boolean;
  item_timing?: ItemTiming;
  customizations?: any;
}

export type BecknContext = {
  action: string;
  bap_id: string;
  bap_uri: string;
  bpp_id?: string;
  bpp_uri?: string;
  domain: string;
  message_id: string;
  timestamp: string;
  transaction_id: string;
  ttl?: string;
  core_version: string;
  country?: string;
  city?: string;
};

export interface Input {}
