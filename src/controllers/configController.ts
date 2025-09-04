import { Request, Response } from "express";
import { actionConfig, getMockActionObject } from "../config/mock-config";
import logger from "@ondc/automation-logger";
export const getMockConfigController = (req: Request, res: Response) => {
	try {
		logger.info("Fetching mock configs");
		const completeConfig: any[] = [];
		const actionFactory = actionConfig.codes;
		for (const actionObj of actionFactory) {
			const actionId = actionObj.action_id;
			const code = actionObj.code;
			const action = actionObj.action;
			const mockAction = getMockActionObject(actionId);
			completeConfig.push({
				action_id: actionId,
				actionCode: code,
				action: action,
				config: mockAction.mockActionConfig,
			});
		}
		res.json(completeConfig);
	} catch (e) {
		logger.error("Error getting mock config", {}, e);
		res.status(500).json({
			error: "Internal Server Error",
			details: e instanceof Error ? e.message : String(e),
		});
	}
};
