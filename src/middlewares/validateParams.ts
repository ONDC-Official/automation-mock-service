import { Request, Response, NextFunction } from "express";
import { logInfo } from "../utils/logger";

function validateRequiredParams(params: string[]) {
	logInfo({
		message: "Entering validateRequiredParams middleware",
		meta: { params },
	});
	return (req: Request, res: Response, next: NextFunction): void => {
		const missingParams = params.filter((param) => !req.query[param]);
		if (missingParams.length > 0) {
			res.status(400).send({
				message: `${missingParams.join(", ")} ${
					missingParams.length > 1 ? "are" : "is"
				} required`,
			});
			logInfo({
				message: "Exiting validateRequiredParams middleware",
				meta: { missingParams },
			});
			return;
		}
		logInfo({
			message: "Exiting validateRequiredParams middleware",
			meta: { params },
		});
		next();
	};
}

export default validateRequiredParams;
