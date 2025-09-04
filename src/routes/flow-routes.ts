import { Router } from "express";
import {
	ActUponFlow,
	getFlowStatus,
	proceedWithFlow,
	startNewFLow,
} from "../controllers/flowController";
import validateRequiredParams from "../middlewares/validateParams";
import otelTracing from "../middlewares/tracing";

const flowRouter = Router();

flowRouter.use((req, res, next) => {
	// For POST requests, get IDs from body
	if (req.method === "POST") {
		otelTracing(
			"body.transaction_id",
			"body.session_id",
			"body.bap_id",
			"body.bpp_id"
		)(req, res, next);
	}
	// For GET requests, get IDs from query
	else if (req.method === "GET") {
		otelTracing(
			"query.transaction_id",
			"query.session_id",
			"query.bap_id",
			"query.bpp_id"
		)(req, res, next);
	} else {
		next();
	}
});

flowRouter.post("/new", startNewFLow, ActUponFlow);

flowRouter.post("/proceed", proceedWithFlow, ActUponFlow);

flowRouter.get(
	"/current-status",
	validateRequiredParams(["transaction_id", "session_id"]),
	getFlowStatus
);

export default flowRouter;
