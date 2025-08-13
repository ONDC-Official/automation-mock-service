import { readFileSync } from "fs";
import {
	MockAction,
	MockOutput,
	saveType,
} from "../../../../classes/mock-action";
import { SessionData } from "../../../../session-types";
import yaml from "js-yaml";
import path from "path";
import { on_track_generator } from "./generator";

export class MockOnTrack extends MockAction {
	get saveData(): saveType {
		return yaml.load(
			readFileSync(path.resolve(__dirname, "../save-data.yaml"), "utf8")
		) as saveType;
	}
	get defaultData(): any {
		return yaml.load(
			readFileSync(path.resolve(__dirname, "./default.yaml"), "utf8")
		);
	}
	get inputs(): any {
		return {};
	}
	name(): string {
		return "on_track";
	}
	get description(): string {
		return "Mock action for on_track response from provider.";
	}
	generator(existingPayload: any, sessionData: SessionData): Promise<any> {
		return on_track_generator(existingPayload, sessionData);
	}
	async validate(targetPayload: any): Promise<MockOutput> {
		if (!targetPayload) return { valid: false, message: "Payload is required" };

			const tracking = targetPayload?.message?.tracking;

			if (!tracking) return { valid: false, message: "Message.tracking is required" };
			if (!tracking.id) return { valid: false, message: "Tracking.id is required" };
			if (!tracking.status) return { valid: false, message: "Tracking.status is required" };

			if (!["active", "inactive"].includes(tracking.status)) {
				return { valid: false, message: "Tracking.status must be 'active' or 'inactive'" };
			}

			if (tracking.status === "active") {
				if (!tracking.location) return { valid: false, message: "Tracking.location is required when status is active" };
				if (!tracking.location.gps) return { valid: false, message: "Tracking.location.gps is required" };
				if (!tracking.location.time?.timestamp) return { valid: false, message: "Tracking.location.time.timestamp is required" };
				if (!tracking.location.updated_at) return { valid: false, message: "Tracking.location.updated_at is required" };
			}

			if (tracking.status === "inactive" && tracking.location) {
				if (tracking.location.gps || tracking.location.time?.timestamp || tracking.location.updated_at) {
				return { valid: false, message: "Tracking.location must be empty when status is inactive" };
				}
			}

			if (tracking.tags && Array.isArray(tracking.tags)) {
				for (const tag of tracking.tags) {
				if (tag.code === "config") {
					const attrEntry = tag.list.find((item: any) => item.code === "attr");
					const typeEntry = tag.list.find((item: any) => item.code === "type");

					if (attrEntry && typeEntry) {
					const attr = attrEntry.value;
					const type = typeEntry.value;

					if (attr === "tracking.location.gps" && type !== "live_poll") {
						return { valid: false, message: "If attr is 'tracking.location.gps', type must be 'live_poll'" };
					}

					if (attr === "tracking.url" && type !== "deferred") {
						return { valid: false, message: "If attr is 'tracking.url', type must be 'deferred'" };
					}

					if (!["tracking.location.gps", "tracking.url"].includes(attr)) {
						return { valid: false, message: "Invalid attr value in config tag" };
					}

					if (!["live_poll", "deferred"].includes(type)) {
						return { valid: false, message: "Invalid type value in config tag" };
					}
					}
				}
				}
			}

			return { valid: true };
	}
	async meetRequirements(sessionData: SessionData): Promise<MockOutput> {
		if (!sessionData.transaction_id) {
			return { valid: false, message: "transaction_id is required" };
		}
		return { valid: true };
	}
}