import { Request, Response, NextFunction } from "express";
import logger from "@ondc/automation-logger";

export default (req: Request, _res: Response, next: NextFunction) => {
	const transaction_id = req.body?.context?.transaction_id;
	logger.info(`Request Log: ${req.method} ${req.url}`, {
		transaction_id,
		body: req.body,
		headers: req.headers,
		query: req.query,
	});
	next();
};
