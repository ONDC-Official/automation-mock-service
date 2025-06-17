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

  // order phase
  fulfillments?: any[];
  selected_items: any[];
  selected_item_id: string;
  quote: any;
  items: any[];
  billing: Record<string, any>;
  payment: any;
  end: any[];
  bnp_features: any[];
  item_availability_enabled?: boolean;
  item_timing?: any;
  customizations?: any;
  on_search_items?: any[];
  provider?: any;
  select_fulfillment?: any[];
  confirm_created_at_timestamp?: string;
  order_id?: string;
  stateCode?: string;
  np_type?: string;
  cancellation_reason_id?: string;
  updated_address?: any;
  updated_inst?: any;
  order_state?: string;
  deliveryAuth?: boolean;
  update_return_fulfillments?: any[];
  return_item_id?: string;
  return_item_count?: string;
  buyer_delivery_start_time?: string;
  buyer_delivery_order_status?: string;
  on_confirm_quote?: any;
  on_update_quote?: any;
  on_search_offers?: any[];
  offers?: any[];
  tags?: any[];
  on_select_items?: any[];
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

export interface Input {
  search_mode?: string;
  items?: any;
  // npType?: string;
  outOfStockitem?: any;
  fulfillmentType?: string;
  gps?: string;
  area_code?: string;
  providerId?: string;
  locationId?: string;
  options?: any;
  selectedFulfillment?: string;
  oosItem?: string;
  returnItemId?: string;
  returnReason?: string;
  partCancelItemId?: string;
  offers?: any;
  offerId?: string;
  isSlottedDelivery?: string;
  isForceCancel?: string;
}
