function getActionConfig() {
	return {
		codes: [
			{
				code: 100,
				action_id: "search1",
				action: "search",
				default: "TRV11/search/search1/default.yaml",
				message_id: true,
			},
			{
				code: 101,
				action_id: "search2",
				action: "search",
				message_id: true,
				default: "TRV11/search/search2/default.yaml",
			},
			{
				code: 102,
				action_id: "on_search1",
				action: "on_search",
				default: "TRV11/search/on_search1/default.yaml",
				message_id: false,
			},
			{
				code: 103,
				action_id: "on_search2",
				action: "on_search",
				default: "TRV11/search/on_search2/default.yaml",
				message_id: false,
			},
			{
				code: 104,
				action_id: "select",
				action: "select",
				default: "TRV11/search/select/default.yaml",
				message_id: true,
			},
			{
				code: 105,
				action_id: "on_select",
				action: "on_select",
				default: "TRV11/search/on_select/default.yaml",
				message_id: false,
			},
			{
				code: 106,
				action_id: "init",
				action: "init",
				default: "TRV11/search/init/default.yaml",
				message_id: true,
			},
			{
				code: 107,
				action_id: "on_init",
				action: "on_init",
				default: "TRV11/search/on_init/default.yaml",
				message_id: false,
			},
			{
				code: 108,
				action_id: "confirm",
				action: "confirm",
				default: "TRV11/search/confirm/default.yaml",
				message_id: true,
			},
			{
				code: 109,
				action_id: "on_confirm",
				action: "on_confirm",
				default: "TRV11/search/on_confirm/default.yaml",
				message_id: false,
			},
			{
				code: 110,
				action_id: "status",
				action: "status",
				default: "TRV11/search/status/default.yaml",
				message_id: true,
			},
			{
				code: 111,
				action_id: "on_status",
				action: "on_status",
				default: "TRV11/search/on_status/default.yaml",
				message_id: false,
			},
			{
				code: 112,
				action_id: "unsolicited_on_status",
				action: "on_status",
				default: "TRV11/search/on_status/default.yaml",
				message_id: true,
			},
		],
	};
}

export function getActionData(code: number) {
	const actionConfig = getActionConfig();
	const actionData = actionConfig.codes.find((action) => action.code === code);
	if (actionData) {
		return actionData;
	}
	throw new Error(`Action code ${code} not found`);
}
