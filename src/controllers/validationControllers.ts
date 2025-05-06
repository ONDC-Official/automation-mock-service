import { NextFunction, Request, Response } from "express";
import { logInfo, logDebug, logError } from "../utils/logger";

import { ApiRequest } from "../routes/manual";
import { performL2Validations } from "../generated/L2-validations";
import { loadSessionData } from "../services/data-services";

export async function l2Validation(
	req: ApiRequest,
	res: Response,
	next: NextFunction
) {
	const transactionId = req.body.context?.transaction_id || "unknown";

	logInfo({
		message: "Entering l2Validation function",
		transaction_id: transactionId,
		meta: { action: req.params.action },
	});

	try {
		logDebug({
			message: "Loading session data",
			transaction_id: transactionId,
		});
		const sessionData = await loadSessionData(transactionId);

		logDebug({
			message: "Performing L2 validations",
			transaction_id: transactionId,
			meta: { action: req.params.action },
		});
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
			logDebug({
				message: "Validation error found",
				transaction_id: transactionId,
				meta: { error: req.l2Error },
			});
		}

		logInfo({
			message: `L2 validations completed with ${
				errors.filter((s) => !s.valid).length
			} errors`,
			transaction_id: transactionId,
		});
		next();
	} catch (e) {
		logError({
			message: "Failed to run L2 validations",
			transaction_id: transactionId,
			error: e,
		});
		next();
	}

	logInfo({
		message: "Exiting l2Validation function",
		transaction_id: transactionId,
	});
}
