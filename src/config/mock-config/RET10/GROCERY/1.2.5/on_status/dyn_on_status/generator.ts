import { SessionData } from "../../../../session-types";
import { Fulfillments } from "../../api-objects/fulfillments";
import { createGenericOnStatus } from "../on_status_packed/generator";

const stateDict = {
	Pending: ["In-Progress", "Packed"],
	Packed: ["In-Progress", "Agent-assigned"],
	"Agent-assigned": ["In-Progress", "Order-picked-up"],
	"Order-picked-up": ["In-Progress", "Out-for-delivery"],
	"Out-for-delivery": ["In-Progress", "Order-delivered"],
};

export async function dyn_on_status_generator(
	existingPayload: any,
	sessionData: SessionData
) {
	console.log("\n *** dyn_on_status_generator *** \n");
	const generalPayload = createGenericOnStatus(existingPayload, sessionData);
	const fulfillments = sessionData.on_status_fulfillments as Fulfillments;
	console.log("Fulfillments in session data:", fulfillments);
	let target = fulfillments.find((f) => {
		console.log("Checking fulfillment state:", f.state?.descriptor?.code);
		return [
			"Packed",
			"Agent-assigned",
			"Order-picked-up",
			"Out-for-delivery",
		].includes(f.state?.descriptor?.code ?? "");
	});
	console.log("Target fulfillment found:", target?.id);
	if (!target) {
		target = fulfillments.find((f) =>
			["Pending"].includes(f.state?.descriptor?.code ?? "")
		);
		console.log("Target fulfillment found:", target?.id);
	}
	if (target) {
		console.log("Target fulfillment found:", target?.id);
		const data =
			stateDict[target.state?.descriptor?.code as keyof typeof stateDict];
		generalPayload.message.order.state = data[0];
		if (target.state && target.state.descriptor) {
			target.state.descriptor.code = data[1];
		}
		if (target.state?.descriptor?.code === "Order-delivered") {
			target = {
				...target,
				end: {
					...target.end,
					time: {
						...target.end?.time,
						timestamp: new Date().toISOString(),
					},
				},
			};
		}
		if (target.state?.descriptor?.code === "Order-picked-up") {
			target = {
				...target,
				start: {
					...target.start,
					time: {
						...target.start?.time,
						timestamp: new Date().toISOString(),
					},
				},
			};
		}
	}

	if (
		fulfillments.every((f) => f.state?.descriptor?.code === "Order-delivered")
	) {
		generalPayload.message.order.state = "Completed";
	}
	generalPayload.message.order.fulfillments =
		sessionData.on_status_fulfillments;
	return generalPayload;
}
