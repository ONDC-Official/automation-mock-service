import "./config/otel-config";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import logger from "@ondc/automation-logger";
import manualRouter from "./routes/manual";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swagger.config";
import { setAckResponse, setBadRequestNack } from "./utils/ackUtils";
import flowRouter from "./routes/flow-routes";
import requestLog from "./middlewares/requestLog";
import responseLog from "./middlewares/responseLog";
import configRouter from "./routes/configRoutes";
const createServer = (): Application => {
	const app = express();

	// Middleware
	app.use(express.json({ limit: "50mb" }));
	app.use(cors());
	app.use(logger.getCorrelationIdMiddleware());

	app.use(requestLog);
	app.use(responseLog);

	const domain = process.env.DOMAIN;
	// var version = process.env.VERSION;
	if (!domain) {
		throw new Error("Domain and version are required in env");
	}

	const base = `/mock/${domain}`;

	//@ts-ignore
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	app.get("/api-docs.json", (_req, res) => {
		res.setHeader("Content-Type", "application/json");
		res.send(swaggerSpec);
	});

	app.use(`${base}/manual`, manualRouter);

	app.use(`${base}/flows`, flowRouter);

	app.use(`${base}/config`, configRouter);

	// duplicates for playground mock
	app.use(`mock/playground/manual`, manualRouter);
	app.use(`mock/playground/flows`, flowRouter);

	// Health Check
	app.get(`${base}/health`, (req: Request, res: Response) => {
		res.status(200).send(setAckResponse(true));
	});

	// Error Handling Middleware
	app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
		logger.error(err.message, {}, { stack: err.stack });
		res.status(200).send(setBadRequestNack(err.message));
	});

	return app;
};

export default createServer;
