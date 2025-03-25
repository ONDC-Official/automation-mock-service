export interface SessionData {
  subscriber_url: string | undefined;
  transaction_id: string | undefined;
  message_id: string | undefined;
  last_action: string | undefined;
  mock_type: string | undefined;
  city_code: string | undefined;
  bap_id: string | undefined;
  bap_uri: string | undefined;
  bpp_id: string | undefined;
  bpp_uri: string | undefined;
  category_id?: string;
  shipment_method?: string;
  fulfillments?: string;
  provider_id?: string;
  location_id?: string;
  error_code?: string;
  error_message?: string;
}

export type BecknContext = {
  action: string;
  bap_id: string;
  bap_uri: string;
  bpp_id?: string;
  bpp_uri?: string;
  domain: string;
  location?: {
    city: {
      code: string;
    };
    country: {
      code: string;
    };
  };
  message_id: string;
  timestamp: string;
  transaction_id: string;
  ttl: string;
  core_version: string;
  country?: string;
  city?: string;
};
