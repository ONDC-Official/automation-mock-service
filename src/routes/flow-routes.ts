import { Router } from "express";
import {
	ActUponFlow,
	getFlowStatus,
	proceedWithFlow,
	startNewFLow,
} from "../controllers/flowController";
import validateRequiredParams from "../middlewares/validateParams";

const flowRouter = Router();

/**
 * @swagger
 * /flow/new:
 *   post:
 *     summary: Start a new flow
 *     description: Initializes a new flow with the provided session_id and flow_id.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - flow_id
 *               - session_id
 *             properties:
 *               transaction_id:
 *                 type: string
 *                 example: "station_based_flow"
 *               session_id:
 *                 type: string
 *                 example: "sess_abcdef"
 *               json_path_changes:
 *                 type: object
 *                 additionalProperties: true
 *                 description: |
 *                   Optional key-value map of JSONPath expressions and replacement values.
 *                   Example: { "$.order.amount": 500, "$.user.name": "Alice" }
 *                 example:
 *                   $.order.amount: 500
 *                   $.user.name: "Alice"
 *     responses:
 *       200:
 *         description: Successfully proceeded with flow
 *       204:
 *         description: Input is required for the next step
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User input is required"
 *                 input:
 *                   $ref: '#/components/schemas/FormFieldConfigType'
 *       400:
 *         description: transaction_id or session_id not found in request body
 *       500:
 *         description: Internal server error
 */
flowRouter.post("/new", startNewFLow, ActUponFlow);

/**
 * @swagger
 * /flow/proceed:
 *   post:
 *     summary: Proceed with flow based on transaction and session
 *     description: Validates transaction and session IDs, fetches associated flow and data, then proceeds. Allows optional JSON path overrides for mock response.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transaction_id
 *               - session_id
 *             properties:
 *               transaction_id:
 *                 type: string
 *                 example: "870782be-6757-43f1-945c-8eeaf9536259"
 *               session_id:
 *                 type: string
 *                 example: "sess_abcdef"
 *               json_path_changes:
 *                 type: object
 *                 additionalProperties: true
 *                 description: |
 *                   Optional key-value map of JSONPath expressions and replacement values.
 *                   Example: { "$.order.amount": 500, "$.user.name": "Alice" }
 *                 example:
 *                   $.order.amount: 500
 *                   $.user.name: "Alice"
 *     responses:
 *       200:
 *         description: Successfully proceeded with flow
 *       204:
 *         description: Input is required for the next step
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User input is required"
 *                 input:
 *                   $ref: '#/components/schemas/FormFieldConfigType'
 *       400:
 *         description: transaction_id or session_id not found in request body
 *       500:
 *         description: Internal server error
 */
flowRouter.post("/proceed", proceedWithFlow, ActUponFlow);

/**
 * @swagger
 * /flow/current-status:
 *   get:
 *     summary: Get current flow status
 *     description: Returns the current status of the transaction/session flow
 *     parameters:
 *       - in: query
 *         name: transaction_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the transaction
 *       - in: query
 *         name: session_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the session
 *     responses:
 *       200:
 *         description: Current flow status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sequence:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         enum: [COMPLETE, LISTENING, RESPONDING, WAITING, INPUT-REQUIRED]
 *                       actionId:
 *                         type: string
 *                       owner:
 *                         type: string
 *                         enum: [BAP, BPP]
 *                       actionType:
 *                         type: string
 *                       input:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/FormFieldConfigType'
 *                       payloads:
 *                         $ref: '#/components/schemas/ReducedApiData'
 *       400:
 *         description: transaction_id or session_id not found in query
 *       500:
 *         description: Error in fetching flow status
 */
flowRouter.get(
	"/current-status",
	validateRequiredParams(["transaction_id", "session_id"]),
	getFlowStatus
);

export default flowRouter;
