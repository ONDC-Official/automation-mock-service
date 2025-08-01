import { Request, Response, NextFunction } from "express";
import logger from "@ondc/automation-logger";
import { getLoggerData } from "../utils/logger-utils";

export default (req: Request, _res: Response, next: NextFunction) => {
	const transaction_id = req.body?.context?.transaction_id;
	logger.info(
		`Request received: ${req.method} ${req.url} - Transaction ID: ${
			transaction_id || "N/A"
		}`,
		getLoggerData(req)
	);
	next();
};
