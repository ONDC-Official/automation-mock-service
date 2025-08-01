import { Request, Response, NextFunction } from "express";
import logger from "@ondc/automation-logger";
import { getLoggerData } from "../utils/logger-utils";

export default (req: Request, res: Response, next: NextFunction) => {
	const originalJson = res.json;
	const originalSend = res.send;
	res.json = function (data: any) {
		logger.info(`Response Log`, data, getLoggerData(req));
		// Call the original res.json with the data
		return originalJson.call(this, data);
	};
	res.send = function (data: any) {
		logger.info(`Response Log`, data, getLoggerData(req));
		// Call the original res.send with the data
		return originalSend.call(this, data);
	};
	next();
};
