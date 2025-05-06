// import { Router } from "express";
// import { setAckResponse } from "../utils/ackUtils";
// import { l2Validation } from "../controllers/validationControllers";
// import { saveDataMiddleware } from "../controllers/dataControllers";
// import { initAsyncMiddleware } from "../controllers/asyncResponseController";
// import { logInfo } from "../utils/logger";

// const defaultRouter = Router();

// defaultRouter.post(
// 	"/:action",
// 	l2Validation,
// 	saveDataMiddleware,
// 	initAsyncMiddleware,
// 	(req, res) => {
// 		logInfo({
// 			message: "Entering Default Route",
// 			transaction_id: req.body.context.transaction_id,
// 		});
// 		res.status(200).send(setAckResponse(true));
// 		logInfo({
// 			message: "Exiting Default Route",
// 			transaction_id: req.body.context.transaction_id,
// 		});
// 	}
// );

// export default defaultRouter;
