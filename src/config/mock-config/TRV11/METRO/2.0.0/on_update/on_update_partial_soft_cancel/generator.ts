import { randomBytes } from "crypto";
import { SessionData } from "../../../../session-types";

function generateQrToken(): string {
	return randomBytes(32).toString("base64");
}
function updateOrderTimestamps(payload: any) {
	const now = new Date().toISOString();
	if (payload.message.order) {
	  payload.message.order.created_at = now;
	  payload.message.order.updated_at = now;
	}
	return payload;
  }

function updateFulfillmentsWithParentInfo(fulfillments: any[]): void {
	const validTo = "2024-07-23T23:59:59.999Z";

	fulfillments.forEach((fulfillment) => {
		// Generate a random QR token
		const qrToken = generateQrToken();

		// Ensure stops array exists
		fulfillment.stops = fulfillment.stops || [];

		// If a stop exists, modify the first stop; otherwise, create a new one
		if (fulfillment.stops.length > 0) {
			fulfillment.stops[0].authorization = {
				type: "QR",
				token: qrToken,
				valid_to: validTo,
				status: "UNCLAIMED",
			};
		} else {
			fulfillment.stops.push({
				type: "START",
				authorization: {
					type: "QR",
					token: qrToken,
					valid_to: validTo,
					status: "UNCLAIMED",
				},
			});
		}

		// Generate a random ticket number
		const ticketNumber = Math.random().toString(36).substring(2, 10);

		// Ensure tags array exists
		fulfillment.tags = fulfillment.tags || [];

		// Add the new TICKET_INFO tag
		fulfillment.tags.push({
			descriptor: {
				code: "TICKET_INFO",
			},
			list: [
				{
					descriptor: {
						code: "NUMBER",
					},
					value: ticketNumber,
				},
			],
		});
	});
}


export async function onUpdatePartialSoftCancelGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  if (!Array.isArray(sessionData.updated_payments) || sessionData.updated_payments.length === 0 || !sessionData.updated_payments[0]) {
    sessionData.updated_payments = existingPayload.message?.order?.payments || [];
  }

  if (sessionData.updated_payments && sessionData.updated_payments[0]) {
    if (!sessionData.updated_payments[0].params) {
      sessionData.updated_payments[0].params = {};
    }
    sessionData.updated_payments[0].params.bank_code = "XXXXXXXX";
    sessionData.updated_payments[0].params.bank_account_number =
      "xxxxxxxxxxxxxx";
  }

  const fulfillments = (Array.isArray(sessionData.fulfillments) && sessionData.fulfillments.length > 0)
    ? sessionData.fulfillments
    : existingPayload.message?.order?.fulfillments || [];

  updateFulfillmentsWithParentInfo(fulfillments);

  // Ensure all stops have location.descriptor.code to pass L1 validation
  fulfillments.forEach((fulfillment: any) => {
    fulfillment.stops = fulfillment.stops || [];
    fulfillment.stops.forEach((stop: any) => {
      if (stop.location && stop.location.descriptor && !stop.location.descriptor.code) {
        stop.location.descriptor.code = stop.location.descriptor.name
          ? stop.location.descriptor.name.toUpperCase().replace(/\s+/g, "_")
          : "STOP_CODE";
      }
    });
  });

  const order = existingPayload.message.order;

  // Preserve original order id
  order.id = order.id || sessionData.order_id;

  // Update status for partial cancellation
  order.status = "SOFT_CANCEL";

  // Restore saved objects
  if (sessionData.items?.length) {
    order.items = sessionData.items;
  }

  if (sessionData.provider) {
    order.provider = sessionData.provider;
  }

  order.fulfillments = fulfillments;

  if (sessionData.billing) {
    order.billing = sessionData.billing;
  }

  if (sessionData.quote) {
    order.quote = sessionData.quote;
  }

  order.payments = sessionData.updated_payments;

  if (sessionData.cancellation_terms?.length) {
    order.cancellation_terms = sessionData.cancellation_terms;
  }

  if (sessionData.tags?.length) {
    order.tags = sessionData.tags;
  }

  // Keep original created_at from confirm
  if (sessionData.created_at) {
    order.created_at = sessionData.created_at;
  }

  // Only update updated_at
  order.updated_at = new Date().toISOString();

  return existingPayload;
}
