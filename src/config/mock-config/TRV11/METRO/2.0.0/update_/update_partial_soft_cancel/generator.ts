import { randomBytes } from "crypto";
import { SessionData } from "../../../../session-types";
import { join } from "path";

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


export async function UpdatePartialSoftCancelGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  console.log(`sesssion data in updatePortal : ${JSON.stringify(sessionData)}`)
  const cancelledFulfillment =
    Array.isArray(sessionData.fulfillments)
      ? sessionData.fulfillments[0] // F2
      : sessionData.fulfillments;

  existingPayload.message = {
    update_target: "order.fulfillments",
    order: {
      id: sessionData.order_id || existingPayload.message?.order?.id || "077b248f",
      fulfillments: [
        {
          id: cancelledFulfillment?.id || "F2",
          type: cancelledFulfillment?.type || "TRIP",
        },
      ],
      cancellation: {
        reason: {
          id: "001",
          descriptor: {
            code: "SOFT_CANCEL",
          },
        },
      },
    },
  };

  return existingPayload;
}
