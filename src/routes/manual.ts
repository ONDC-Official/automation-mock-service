import { Router, Request } from "express";
import { saveDataMiddleware } from "../controllers/dataControllers";
import { setAckResponse } from "../utils/ackUtils";
import { Flow } from "../types/flow-types";
import { TransactionCache } from "../types/transaction-cache";
import {
  ActUponFlow,
  setFlowAndTransactionId,
} from "../controllers/flowController";
import { SessionCache } from "../types/api-session-cache";
import { l2Validation } from "../controllers/validationControllers";
import { logInfo } from "../utils/logger";
import otelTracing from "../middlewares/tracing";

const manualRouter = Router();

export interface ApiRequest extends Request {
  l2Error?: {
    code: number;
    message: string;
  };
  flow?: Flow;
  transactionData?: TransactionCache;
  transactionId?: string;
  subscriberUrl?: string;
  flowId?: string;
  apiSessionCache?: SessionCache;
}

manualRouter.post(
  "/:action",
  otelTracing(
		'body.context.transaction_id',
		'body.context.session_id',
		'body.context.bap_id',
		'body.context.bpp_id'
	),
  // l2Validation,
  saveDataMiddleware,
  setFlowAndTransactionId,
  ActUponFlow,
  (req, res) => {
    logInfo({
      message: "Entering Manual Route",
      meta: {
        action: req.params.action,
      },
      transaction_id: req.body.context.transaction_id,
    });
    res.status(200).send(setAckResponse(true));
    logInfo({
      message: "Exiting Manual Route",
      meta: {
        action: req.params.action,
      },
      transaction_id: req.body.context.transaction_id,
    });
  }
);

export default manualRouter;

// l2 -> savedata -> load transaction -> load flow -> map flow with txn -> decide next action
// -> input required ? update cache for input and rest : respond with action and rest
// ui -> check if input is required -> ask for what is required -> show form -> submit -> mock response with action and rest
