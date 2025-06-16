import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

import { ApiRequest } from "../routes/manual";
import { performL2Validations } from "../config/mock-config/generated/L2-validations";
import { loadMockSessionData } from "../services/data-services";

export async function l2Validation(
	req: ApiRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const sessionData = await loadMockSessionData(
			req.body.context.transaction_id
		);
		const errors = performL2Validations(
			req.params.action,
			req.body,
			false,
			sessionData
		);
		const firstError = errors.find((s) => !s.valid);
		if (firstError) {
			req.l2Error = {
				code: firstError.code,
				message: firstError.description || "validation failed",
			};
		}
		logger.info(
			`L2 validations completed found ${
				errors.filter((s) => !s.valid).length
			} errors`
		);
		next();
	} catch (e) {
		logger.error("failed to run L2 validations", e);
		next();
	}
}
