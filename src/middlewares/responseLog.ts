import { Request, Response, NextFunction } from "express";
import logger from "@ondc/automation-logger";

export default (req: Request, res: Response, next: NextFunction) => {
	const originalJson = res.json;
	const originalSend = res.send;
	res.json = function (data: any) {
		const transaction_id = req.body?.context?.transaction_id;
		logger.info(`Response Log: ${req.method} ${req.url}`, {
			transaction_id,
			body: data,
			headers: res.getHeaders(),
			statusCode: res.statusCode,
			correlationId: req.correlationId,
		});
		// Call the original res.json with the data
		return originalJson.call(this, data);
	};
	res.send = function (data: any) {
		const transaction_id = req.body?.transaction_id;
		logger.info(`Response Log: ${req.method} ${req.url}`, {
			transaction_id,
			body: data,
			headers: res.getHeaders(),
			statusCode: res.statusCode,
			correlationId: req.correlationId,
		});
		// Call the original res.send with the data
		return originalSend.call(this, data);
	};
	next();
};
