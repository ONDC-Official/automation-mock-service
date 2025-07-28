import { NextFunction, Request, Response } from "express";
import { logError, logger, logInfo } from "../utils/logger";
import { saveData } from "../services/data-services";
import { ApiRequest } from "../routes/manual";

/*
	save data middleware:
	update the session data against the transaction id 
	and json paths to be saved are all present in the api config
*/
export async function saveDataMiddleware(
	req: ApiRequest,
	res: Response,
	next: NextFunction
) {
	try {
		logInfo({
			message: "Entering saveDataMiddleware",
			meta: { action: req.params.action },
			transaction_id: req.body.context.transaction_id,
		});
		const action = req.params.action;
		const body = req.body;
		const subscriber_url = action.includes("on_")
			? body.context.bpp_uri
			: body.context.bap_uri;
		await saveData(action, body, req.l2Error);
		logInfo({
			message: "Exiting saveDataMiddleware",
			meta: { action: req.params.action },
			transaction_id: req.body.context.transaction_id,
		});
		next();
	} catch (err) {
		// logger.error("Error in saveDataMiddleware", err);
		logError({
			message: "Error in saveDataMiddleware",
			meta: { action: req.params.action },
			transaction_id: req.body.context.transaction_id,
			error: err,
		});
		res.status(500).send("Error in saveDataMiddleware");
	}
}
