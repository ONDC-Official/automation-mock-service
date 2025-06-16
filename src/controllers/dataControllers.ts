import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
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
		const action = req.params.action;
		const body = req.body;
		await saveData(action, body, req.l2Error);
		next();
	} catch (err) {
		logger.error("Error in saveDataMiddleware", err);
		res.status(500).send("Error in saveDataMiddleware");
	}
}
