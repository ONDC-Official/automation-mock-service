import { NextFunction, Request, Response } from "express";
import { logError, logger, logInfo } from "../utils/logger";

import { ApiRequest } from "../routes/manual";
import { performL2Validations } from "../config/mock-config/generated/L2-validations";
import { loadMockSessionData } from "../services/data-services";

export async function l2Validation(
	req: ApiRequest,
	res: Response,
	next: NextFunction
) {
	try {
		logInfo({
			message: "L2 Validation",
			meta: { action: req.params.action },
			});
		const action = req.params.action;
		const body = req.body;
		const subscriber_url = action.includes("on_")?body.context.bpp_uri : body.context.bap_uri
		const sessionData = await loadMockSessionData(
			req.body.context.transaction_id,
			subscriber_url
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
		// logger.info(
		// 	`L2 validations completed found ${
		// 		errors.filter((s) => !s.valid).length
		// 	} errors`
		// );
		logInfo({
			message: `L2 validations completed found ${errors.filter((s) => !s.valid).length} errors`,
			meta: { action: req.params.action },
			transaction_id: req.body.context.transaction_id,
		});
		next();
	} catch (e) {
		// logger.error("failed to run L2 validations", e);
		logError({
			message: "failed to run L2 validations",
			meta: { action: req.params.action },
			transaction_id: req.body.context.transaction_id,
			error: e,
		});
		next();
	}
}
