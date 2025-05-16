function getActionConfig() {
	return {
		codes: [
    {
      "code": 100,
      "action_id": "search1_METRO",
      "action": "search",
      "default": "METRO/2.0.0/search/search1/default.yaml",
      "message_id": true
    },
    {
      "code": 101,
      "action_id": "search2_METRO",
      "action": "search",
      "message_id": true,
      "default": "METRO/2.0.0/search/search2/default.yaml"
    },
    {
      "code": 102,
      "action_id": "on_search1_METRO",
      "action": "on_search",
      "default": "METRO/2.0.0/on_search/on_search1/default.yaml",
      "message_id": false
    },
    {
      "code": 103,
      "action_id": "on_search2_METRO",
      "action": "on_search",
      "default": "METRO/2.0.0/on_search/on_search2/default.yaml",
      "message_id": false
    },
    {
      "code": 104,
      "action_id": "select_METRO",
      "action": "select",
      "default": "METRO/2.0.0/select/default.yaml",
      "message_id": true
    },
    {
      "code": 105,
      "action_id": "on_select_METRO",
      "action": "on_select",
      "default": "METRO/2.0.0/on_select/default.yaml",
      "message_id": false
    },
    {
      "code": 106,
      "action_id": "init_METRO",
      "action": "init",
      "default": "METRO/2.0.0/init/default.yaml",
      "message_id": true
    },
    {
      "code": 107,
      "action_id": "on_init_METRO",
      "action": "on_init",
      "default": "METRO/2.0.0/on_init/default.yaml",
      "message_id": false
    },
    {
      "code": 108,
      "action_id": "confirm_METRO",
      "action": "confirm",
      "default": "METRO/2.0.0/confirm/default.yaml",
      "message_id": true
    },
    {
      "code": 109,
      "action_id": "on_confirm_METRO",
      "action": "on_confirm",
      "default": "METRO/2.0.0/on_confirm/on_confirm/default.yaml",
      "message_id": false
    },
    {
      "code": 110,
      "action_id": "on_confirm_delayed_METRO",
      "action": "on_confirm",
      "default": "METRO/2.0.0/on_confirm/on_confirm_delayed/default.yaml",
      "message_id": false
    },
    {
      "code": 111,
      "action_id": "status_METRO",
      "action": "status",
      "default": "METRO/2.0.0/status/status_active/default.yaml",
      "message_id": true
    },
    {
      "code": 112,
      "action_id": "on_status_active_METRO",
      "action": "on_status",
      "default": "METRO/2.0.0/on_status/on_status_active/default.yaml",
      "message_id": false
    },
    {
      "code": 113,
      "action_id": "on_status_complete_METRO",
      "action": "on_status",
      "default": "METRO/2.0.0/onon_status_complete/default.yaml",
      "message_id": false
    },
    {
      "code": 114,
      "action_id": "on_status_unsolicited_METRO",
      "action": "on_status",
      "default": "METRO/2.0.0/on_status_complete/default.yaml",
      "message_id": true
    },
    {
      "code": 115,
      "action_id": "cancel_METRO",
      "action": "cancel",
      "default": "METRO/2.0.0/cancel/cancel_hard/default.yaml",
      "message_id": true
    },
    {
      "code": 116,
      "action_id": "cancel_soft_METRO",
      "action": "cancel",
      "default": "METRO/2.0.0/cancel/cancel_soft/default.yaml",
      "message_id": true
    },
    {
      "code": 117,
      "action_id": "cancel_hard_METRO",
      "action": "cancel",
      "default": "METRO/2.0.0/cancel/cancel_hard/default.yaml",
      "message_id": true
    },
    {
      "code": 118,
      "action_id": "on_cancel_METRO",
      "action": "on_cancel",
      "default": "METRO/2.0.0/on_cancel/on_cancel_hard/default.yaml",
      "message_id": false
    },
    {
      "code": 119,
      "action_id": "on_cancel_soft_METRO",
      "action": "on_cancel",
      "default": "METRO/2.0.0/on_cancel/on_cancel_soft/default.yaml",
      "message_id": false
    },
    {
      "code": 120,
      "action_id": "on_cancel_hard_METRO",
      "action": "on_cancel",
      "default": "METRO/2.0.0/on_cancel/on_cancel_hard/default.yaml",
      "message_id": false
    },
    {
      "code": 121,
      "action_id": "on_cancel_init_METRO",
      "action": "on_cancel",
      "default": "METRO/2.0.0/on_cancel/default.yaml",
      "message_id": false
    },
    {
      "code": 122,
      "action_id": "on_update_accepted_METRO",
      "action": "on_update",
      "default": "METRO/2.0.0/on_update/on_update_accepted/default.yaml",
      "message_id": true
    },
    {
      "code": 123,
      "action_id": "search1_BUS",
      "action": "search",
      "default": "BUS/2.0.0/search/search1/default.yaml",
      "message_id": true
    },
    {
      "code": 124,
      "action_id": "search2_BUS",
      "action": "search",
      "message_id": true,
      "default": "BUS/2.0.0/search/search2/default.yaml"
    },
    {
      "code": 125,
      "action_id": "on_search1_BUS",
      "action": "on_search",
      "default": "BUS/2.0.0/on_search/on_search1/default.yaml",
      "message_id": false
    },
    {
      "code": 126,
      "action_id": "on_search2_BUS",
      "action": "on_search",
      "default": "BUS/2.0.0/on_search/on_search2/default.yaml",
      "message_id": false
    },
    {
      "code": 127,
      "action_id": "select_BUS",
      "action": "select",
      "default": "BUS/2.0.0/select/default.yaml",
      "message_id": true
    },
    {
      "code": 128,
      "action_id": "on_select_BUS",
      "action": "on_select",
      "default": "BUS/2.0.0/on_select/default.yaml",
      "message_id": false
    },
    {
      "code": 129,
      "action_id": "init_BUS",
      "action": "init",
      "default": "BUS/2.0.0/init/default.yaml",
      "message_id": true
    },
    {
      "code": 130,
      "action_id": "on_init_BUS",
      "action": "on_init",
      "default": "BUS/2.0.0/on_init/default.yaml",
      "message_id": false
    },
    {
      "code": 131,
      "action_id": "confirm_BUS",
      "action": "confirm",
      "default": "BUS/2.0.0/confirm/default.yaml",
      "message_id": true
    },
    {
      "code": 132,
      "action_id": "on_confirm_BUS",
      "action": "on_confirm",
      "default": "BUS/2.0.0/on_confirm/on_confirm/default.yaml",
      "message_id": false
    },
    {
      "code": 133,
      "action_id": "on_confirm_delayed_BUS",
      "action": "on_confirm",
      "default": "BUS/2.0.0/on_confirm/on_confirm_delayed/default.yaml",
      "message_id": false
    },
    {
      "code": 134,
      "action_id": "status_BUS",
      "action": "status",
      "default": "BUS/2.0.0/status/status_active/default.yaml",
      "message_id": true
    },
    {
      "code": 135,
      "action_id": "on_status_BUS",
      "action": "on_status",
      "default": "BUS/2.0.0/on_status/on_status_active/default.yaml",
      "message_id": false
    },
    {
      "code": 136,
      "action_id": "on_status_active_BUS",
      "action": "on_status",
      "default": "BUS/2.0.0/on_status/on_status_active/default.yaml",
      "message_id": false
    },
    {
      "code": 137,
      "action_id": "on_status_unsolicited_BUS",
      "action": "on_status",
      "default": "BUS/2.0.0/on_status/on_status_complete/default.yaml",
      "message_id": true
    },
    {
      "code": 138,
      "action_id": "cancel_BUS",
      "action": "cancel",
      "default": "BUS/2.0.0/cancel/cancel/default.yaml",
      "message_id": true
    },
    {
      "code": 139,
      "action_id": "cancel_soft_BUS",
      "action": "cancel",
      "default": "BUS/2.0.0/cancel/cancel_soft/default.yaml",
      "message_id": true
    },
    {
      "code": 140,
      "action_id": "cancel_hard_BUS",
      "action": "cancel",
      "default": "BUS/2.0.0/cancel/cancel_hard/default.yaml",
      "message_id": true
    },
    {
      "code": 141,
      "action_id": "on_cancel_BUS",
      "action": "on_cancel",
      "default": "BUS/2.0.0/on_cancel/default.yaml",
      "message_id": false
    },
    {
      "code": 142,
      "action_id": "on_cancel_soft_BUS",
      "action": "on_cancel",
      "default": "BUS/2.0.0/on_cancel/on_cancel_soft/default.yaml",
      "message_id": false
    },
    {
      "code": 143,
      "action_id": "on_cancel_hard_BUS",
      "action": "on_cancel",
      "default": "BUS/2.0.0/on_cancel/on_cancel_hard/default.yaml",
      "message_id": false
    },
    {
      "code": 144,
      "action_id": "on_cancel_init_BUS",
      "action": "on_cancel",
      "default": "BUS/2.0.0/on_cancel/on_cancel_init/default.yaml",
      "message_id": false
    },
    {
      "code": 145,
      "action_id": "on_update_accepted_BUS",
      "action": "on_update",
      "default": "BUS/2.0.0/on_update/on_update_accepted/default.yaml",
      "message_id": true
    },
    {
      "code": 146,
      "action_id": "status_tech_cancel_BUS",
      "action": "status",
      "default": "BUS/2.0.0/status/status_tech_cancel/default.yaml"
    },
    {
      "code": 147,
      "action_id": "on_cancel_hard_BUS",
      "action": "on_cancel",
      "default": "BUS/2.0.0/on_cancel/on_cancel_hard/default.yaml",
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
