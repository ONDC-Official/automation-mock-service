import { Fulfillments } from "./GROCERY/1.2.5/api-objects/fulfillments";

export type SessionData = {
	protocol_session_id: string | undefined;
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
	order_created_at: string | undefined;
	on_select_fulfillments: any | undefined;
	on_status_fulfillments: any | undefined;
	tags: any | undefined;
	bap_terms: any | undefined;
	bpp_terms: any | undefined;
	out_of_stock_item_ids: string[] | undefined;
	cancellation_reason_id: string | undefined;
	update_fulfillments: any | undefined;
	on_select_items: any | undefined;
	selected_offers: any | undefined;
	last_updated_at: string | undefined;
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
}