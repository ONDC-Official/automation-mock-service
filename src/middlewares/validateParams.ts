import { Request, Response, NextFunction } from "express";
import logger from "@ondc/automation-logger";
import { getLoggerData } from "../utils/logger-utils";

function validateRequiredParams(params: string[]) {
	return (req: Request, res: Response, next: NextFunction): void => {
		const missingParams = params.filter((param) => !req.query[param]);
		if (missingParams.length > 0) {
			res.status(400).send({
				message: `${missingParams.join(", ")} ${
					missingParams.length > 1 ? "are" : "is"
				} required`,
			});
			logger.warning(
				`Missing required parameters: ${missingParams.join(", ")}`,
				{
					transaction_id: req.query.transaction_id,
					action_id: req.query.action_id,
					given: req.query,
				},
				getLoggerData(req)
			);
			return;
		}
		next();
	};
}

export default validateRequiredParams;
