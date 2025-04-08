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
	start_location: string | undefined;
	intermediate_location: string | undefined;
	end_location: string | undefined;
	buyer_app_fee: string | undefined;
	vehicle_type: string | undefined;
	fulfillments: any[]; // Replace `any` with a specific type if known
	category_ids: string[]; // Assuming these are strings; adjust if needed
	provider_id: string | undefined;
	fullfillment_ids: string[]; // Assuming these are strings; adjust if needed
	item_ids: string[]; // Assuming these are strings; adjust if needed
	items: any[]; // Replace `any` with a specific type if known
	selected_items: any[];
	selected_item_id: string; // Assuming these are strings; adjust if needed
	billing: Record<string, any>; // Replace `any` with specific types if known
	payments: any[]; // Replace `any` with a specific type if known
	updated_payments: any[]; // Replace `any` with a specific type if known
	order_id: string | undefined;
	quote: any;
	status: string;
	error_code: string | undefined;
	error_message: string | undefined;
	ref_id: string | undefined;
	ttl: string | undefined;
	usecaseId : string | undefined;
	stops: any[];
	update_stop: any[]
	update_quote: any[]
	selected_fulfillments: any[]
	bap_items: any[]
	collected_by: string | undefined
	updated_price: string
	selected_add_ons: any[]
	created_at: string
	cancellation_reason_id: string
	cancellation_quote: any[]
	selected_fulfillment_id: string
}

export type BecknContext = {
	action: string;
	bap_id: string;
	bap_uri: string;
	bpp_id?: string;
	bpp_uri?: string;
	domain: string;
	location: {
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
	version: string;
};
