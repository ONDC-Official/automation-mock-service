import { Router, Request } from "express";
import { l2Validation } from "../controllers/validationControllers";
import { saveDataMiddleware } from "../controllers/dataControllers";
import { setAckResponse } from "../utils/ackUtils";
import { logInfo } from "../utils/logger";

const manualRouter = Router();

export interface ApiRequest extends Request {
	l2Error?: {
		code: number;
		message: string;
	};
}

manualRouter.post("/:action", l2Validation, saveDataMiddleware, (req, res) => {
	logInfo({
		message: "Entering Manual Route",
		transaction_id: req.body.context.transaction_id,
	});
	res.status(200).send(setAckResponse(true));
	logInfo({
		message: "Exiting Manual Route",
		transaction_id: req.body.context.transaction_id,
	});
});

export default manualRouter;
