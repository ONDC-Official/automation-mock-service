import { Request, Response } from "express";
import { getAllMockActionIds } from "../config/mock-config";
import { getMockAction } from "../config/mock-config/TRV14/action-factory";
import logger from "@ondc/automation-logger";
export const getMockConfigController = (req: Request, res: Response) => {
	try {
		logger.info("Fetching mock configs");
		const allActionsIds = getAllMockActionIds();
		const completeConfig: any = {};
		allActionsIds.forEach((actionId) => {
			const mockAction = getMockAction(actionId);
			completeConfig[actionId] = mockAction.mockActionConfig;
		});
		res.json(completeConfig);
	} catch (e) {
		logger.error("Error getting mock config", {}, e);
		res.status(500).json({
			error: "Internal Server Error",
			details: e instanceof Error ? e.message : String(e),
		});
	}
};
