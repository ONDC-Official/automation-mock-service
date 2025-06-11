import { SessionData } from "../../../session-types";
import { v4 as uuidv4 } from "uuid";

export const confirmGenerator = (
	existingPayload: any,
	sessionData: SessionData
) => {
	existingPayload.message.order.id = uuidv4();

	if (sessionData.provider) {
		existingPayload.message.order.provider = sessionData.provider;
	}

	if (sessionData.items) {
		existingPayload.message.order.items = sessionData.items;
	}

	if (sessionData.billing) {
		existingPayload.message.order.billing = sessionData.billing;
	}

	if (sessionData.quote) {
		existingPayload.message.order.quote = sessionData.quote;
	}

	if (sessionData.fulfillments) {
		existingPayload.message.order.fulfillments = sessionData.fulfillments.map(
			(fulfillment) => {
				fulfillment.end.person = {
					name: "person_name_1",
				};
				fulfillment.end.contact = {
					phone: "9886098860",
				};
				fulfillment["@ondc/org/TAT"] = "PT60M";
				fulfillment.tracking = true;

				return fulfillment;
			}
		);
	}

	existingPayload.message.order.payment = {
		params: {
			currency: "INR",
			transaction_id: "3937",
			amount: sessionData.quote.price.value,
		},
		status: "PAID",
		type: "ON-ORDER",
		collected_by: "BAP",
		"@ondc/org/settlement_basis": "delivery",
		"@ondc/org/settlement_window": "P1D",
		"@ondc/org/withholding_amount": "0.00",
		...sessionData.payment,
	};

	if (sessionData?.tags) {
		existingPayload.message.order.tags = [
			...sessionData.tags,
			{
				code: "bap_terms",
				list: [
					{
						code: "accept_bpp_terms",
						value: "Y",
					},
					{
						code: "static_terms",
						value:
							"https://github.com/ONDC-Official/NP-Static-Terms/buyerNP_BNP/1.0/tc.pdf",
					},
					{
						code: "tax_number",
						value: "12ABCDE3456FGZJ",
					},
				],
			},
		];
	}

	existingPayload.message.order.created_at = existingPayload.context.timestamp;
	existingPayload.message.order.updated_at = existingPayload.context.timestamp;

	return existingPayload;
};
