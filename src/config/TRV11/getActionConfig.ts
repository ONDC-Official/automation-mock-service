function getActionConfig() {
	return {
		
			"codes": [
			  {
				"code": 100,
				"action_id": "search1",
				"action": "search",
				"default": "search/search1/default.yaml",
				"message_id": true
			  },
			  {
				"code": 101,
				"action_id": "search2",
				"action": "search",
				"message_id": true,
				"default": "search/search2/default.yaml"
			  },
			  {
				"code": 102,
				"action_id": "on_search1",
				"action": "on_search",
				"default": "on_search/on_search1/default.yaml",
				"message_id": false
			  },
			  {
				"code": 103,
				"action_id": "on_search2",
				"action": "on_search",
				"default": "on_search/on_search2/default.yaml",
				"message_id": false
			  },
			  {
				"code": 104,
				"action_id": "select",
				"action": "select",
				"default": "select/default.yaml",
				"message_id": true
			  },
			  {
				"code": 105,
				"action_id": "on_select",
				"action": "on_select",
				"default": "on_select/default.yaml",
				"message_id": false
			  },
			  {
				"code": 106,
				"action_id": "init",
				"action": "init",
				"default": "init/default.yaml",
				"message_id": true
			  },
			  {
				"code": 107,
				"action_id": "on_init",
				"action": "on_init",
				"default": "on_init/default.yaml",
				"message_id": false
			  },
			  {
				"code": 108,
				"action_id": "confirm",
				"action": "confirm",
				"default": "confirm/default.yaml",
				"message_id": true
			  },
			  {
				"code": 109,
				"action_id": "on_confirm",
				"action": "on_confirm",
				"default": "on_confirm/on_confirm/default.yaml",
				"message_id": false
			  },
			  {
				"code": 110,
				"action_id": "on_confirm_delayed",
				"action": "on_confirm",
				"default": "on_confirm/on_confirm_delayed/default.yaml",
				"message_id": false
			  },
			  {
				"code": 111,
				"action_id": "status",
				"action": "status",
				"default": "status/default.yaml",
				"message_id": true
			  },
			  {
				"code": 112,
				"action_id": "on_status",
				"action": "on_status",
				"default": "on_status/default.yaml",
				"message_id": false
			  },
			  {
				"code": 114,
				"action_id": "cancel",
				"action": "cancel",
				"default": "cancel/default.yaml",
				"message_id": true
			  },
			  {
				"code": 115,
				"action_id": "on_cancel",
				"action": "on_cancel",
				"default": "on_cancel/default.yaml",
				"message_id": false
			  },
			  {
				"code": 116,
				"action_id": "on_update_accepted",
				"action": "on_update",
				"default": "on_update/default.yaml",
				"message_id": true
			  },
			  {
				"code": 117,
				"action_id": "on_update_rejected",
				"action": "on_update",
				"default": "on_update/default.yaml",
				"message_id": true
			  }
			]
		  
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
