import { NextFunction, Request, Response } from "express";
import logger from "@ondc/automation-logger";

import { ApiRequest } from "../routes/manual";
import { performL2Validations } from "../config/mock-config/generated/L2-validations";
import { loadMockSessionData } from "../services/data-services";
import { getLoggerData } from "../utils/logger-utils";

export async function l2Validation(
	req: ApiRequest,
	res: Response,
	next: NextFunction
) {
	try {
		logger.info("Running L2 validations", {
			action: req.params.action,
			transaction_id: req.body.context.transaction_id,
		});
		const action = req.params.action;
		const body = req.body;
		const subscriber_url = action.includes("on_")
			? body.context.bpp_uri
			: body.context.bap_uri;
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
		logger.info("L2 validations completed", {
			action: req.params.action,
			transaction_id: req.body.context.transaction_id,
			errors: errors.map((e) => e.description),
		});
		next();
	} catch (e) {
		logger.error("failed to run L2 validations", getLoggerData(req), e);
		next();
	}
}
