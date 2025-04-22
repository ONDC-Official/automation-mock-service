function getActionConfig() {
  return {
    codes: [
      {
        code: 100,
        action_id: "search_LOGISTICS",
        action: "search",
        default: "search/default.yaml",
        message_id: true,
      },
      {
        code: 101,
        action_id: "init_LOGISTICS",
        action: "init",
        default: "init/default.yaml",
        message_id: true,
      },
      {
        code: 102,
        action_id: "confirm_LOGISTICS",
        action: "confirm",
        default: "confirm/default.yaml",
        message_id: true,
      },
      {
        code: 103,
        action_id: "update_LOGISTICS",
        action: "update",
        default: "update/default.yaml",
        message_id: true,
      },
      {
        code: 104,
        action_id: "track_LOGISTICS",
        action: "track",
        default: "track/default.yaml",
        message_id: true,
      },
      {
        code: 105,
        action_id: "on_search_LOGISTICS",
        action: "on_search",
        default: "on_search/default.yaml",
        message_id: false,
      },
      {
        code: 106,
        action_id: "on_init_LOGISTICS",
        action: "on_init",
        default: "on_init/default.yaml",
        message_id: false,
      },
      {
        code: 107,
        action_id: "on_confirm_LOGISTICS",
        action: "on_confirm",
        default: "on_confirm/default.yaml",
        message_id: false,
      },
      {
        code: 108,
        action_id: "cancel_LOGISTICS",
        action: "cancel",
        default: "cancel/default.yaml",
        message_id: true,
      },
      {
        code: 109,
        action_id: "on_update_LOGISTICS",
        action: "on_update",
        default: "on_update/default.yaml",
        message_id: false,
      },
      {
        code: 110,
        action_id: "on_status_LOGISTICS",
        action: "on_status",
        default: "on_status/default.yaml",
        message_id: false,
      },
      {
        code: 111,
        action_id: "on_track_LOGISTICS",
        action: "on_track",
        default: "on_track/default.yaml",
        message_id: false,
      },
      {
        code: 112,
        action_id: "on_status_1_LOGISTICS",
        action: "on_status",
        default: "on_status/default.yaml",
        message_id: false,
      },
      {
        code: 113,
        action_id: "on_status_2_LOGISTICS",
        action: "on_status",
        default: "on_status/default.yaml",
        message_id: false,
      },
      {
        code: 114,
        action_id: "on_track_LOGISTICS",
        action: "on_track",
        default: "on_track/default.yaml",
        message_id: false,
      },
      {
        code: 115,
        action_id: "on_status_3_LOGISTICS",
        action: "on_status",
        default: "on_status/default.yaml",
        message_id: false,
      },
      {
        code: 116,
        action_id: "select",
        action: "select",
        default: "select/default.yaml",
        message_id: false,
      },
      {
        code: 117,
        action_id: "on_select",
        action: "on_select",
        default: "on_select/default.yaml",
        message_id: false,
      },
      {
        code: 118,
        action_id: "init",
        action: "init",
        default: "init/default.yaml",
        message_id: false,
      },
      {
        code: 119,
        action_id: "on_init",
        action: "on_init",
        default: "on_init/default.yaml",
        message_id:false,
      },
      {
        code: 120,
        action_id: "confirm",
        action: "confirm",
        default: "confirm/default.yaml",
        message_id: false,
      },
      {
        code: 121,
        action_id: "on_confirm",
        action: "on_confirm",
        default: "on_confirm/default.yaml",
        message_id: false,
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
