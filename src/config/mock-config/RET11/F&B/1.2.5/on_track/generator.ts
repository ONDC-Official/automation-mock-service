import { SessionData } from "../../../session-types";

export const onTrackGenerator = (
	existingPayload: any,
	sessionData: SessionData
) => {
	const currentTimestamp = existingPayload.context.timestamp;

	existingPayload.message.tracking.location.time.timestamp = currentTimestamp;
	existingPayload.message.tracking.location.updated_at = currentTimestamp;

	// existingPayload.message.tracking.tags = [
	// 	{
	// 		code: "order",
	// 		list: [
	// 			{
	// 				code: "id",
	// 				value: sessionData.order_id,
	// 			},
	// 		],
	// 	},
	// 	{
	// 		code: "config",
	// 		list: [
	// 			{
	// 				code: "attr",
	// 				value: "tracking.location.gps",
	// 			},
	// 			{
	// 				code: "type",
	// 				value: "live_poll",
	// 			},
	// 		],
	// 	},
	// 	{
	// 		code: "path",
	// 		list: [
	// 			{
	// 				code: "lat_lng",
	// 				value: "12.9740,77.6134",
	// 			},
	// 			{
	// 				code: "sequence",
	// 				value: "1",
	// 			},
	// 		],
	// 	},
	// 	{
	// 		code: "path",
	// 		list: [
	// 			{
	// 				code: "lat_lng",
	// 				value: "12.9740,77.6136",
	// 			},
	// 			{
	// 				code: "sequence",
	// 				value: "2",
	// 			},
	// 		],
	// 	},
	// 	{
	// 		code: "path",
	// 		list: [
	// 			{
	// 				code: "lat_lng",
	// 				value: "12.9740,77.6136",
	// 			},
	// 			{
	// 				code: "sequence",
	// 				value: "3",
	// 			},
	// 		],
	// 	},
	// ];

	return existingPayload;
};
