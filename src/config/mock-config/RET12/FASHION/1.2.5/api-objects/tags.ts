import { SessionData } from "../../../session-types";

export type TagType = {
	code: string;
	list: {
		code: string;
		value: string;
	}[];
};
export type TagsType = TagType[];

export function createTags(
	action: string,
	actionId: string,
	sessionData: SessionData,
	existingTags: any[]
) {}
