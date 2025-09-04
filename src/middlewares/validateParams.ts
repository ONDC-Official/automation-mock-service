import { Request, Response, NextFunction } from "express";
import logger from "@ondc/automation-logger";
import { getLoggerData } from "../utils/logger";

function validateRequiredParams(params: string[]) {
	return (req: Request, res: Response, next: NextFunction): void => {
		logger.info("Validating required parameters", getLoggerData(req));
		const missingParams = params.filter((param) => !req.query[param]);
		if (missingParams.length > 0) {
			logger.error("Missing required parameters", getLoggerData(req), {
				missingParams,
			});
			res.status(400).send({
				message: `${missingParams.join(", ")} ${
					missingParams.length > 1 ? "are" : "is"
				} required`,
			});
			return;
		}
		next();
	};
}

export default validateRequiredParams;
