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
  // l2Validation,
  saveDataMiddleware,
  setFlowAndTransactionId,
  ActUponFlow,
  (req, res) => {
    res.status(200).send(setAckResponse(true));
  }
);

export default manualRouter;

// l2 -> savedata -> load transaction -> load flow -> map flow with txn -> decide next action
// -> input required ? update cache for input and rest : respond with action and rest
// ui -> check if input is required -> ask for what is required -> show form -> submit -> mock response with action and rest
