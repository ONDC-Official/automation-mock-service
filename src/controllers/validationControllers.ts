import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

import { ApiRequest } from "../routes/manual";
import { performL2Validations } from "../generated/L2-validations";
import { loadSessionData } from "../services/data-services";

export async function l2Validation(
	req: ApiRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const action = req.params.action;
		const body = req.body;
		const subscriber_url = action.includes("on_")?body.context.bpp_uri : body.context.bap_uri
		const sessionData = await loadSessionData(req.body.context.transaction_id, subscriber_url);
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
