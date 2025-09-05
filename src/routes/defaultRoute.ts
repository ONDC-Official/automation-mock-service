// import { Router } from "express";
// import { setAckResponse } from "../utils/ackUtils";
// import { l2Validation } from "../controllers/validationControllers";
// import { saveDataMiddleware } from "../controllers/dataControllers";
// import { initAsyncMiddleware } from "../controllers/asyncResponseController";

// const defaultRouter = Router();

// defaultRouter.post(
// 	"/:action",
// 	l2Validation,
// 	saveDataMiddleware,
// 	initAsyncMiddleware,
// 	(req, res) => {
// 		res.status(200).send(setAckResponse(true));
// 	}
// );

// export default defaultRouter;
