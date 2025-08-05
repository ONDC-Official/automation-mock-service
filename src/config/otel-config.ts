// Enable strict mode automatically in ES modules
import dotenv from "dotenv";
dotenv.config();

import { logger } from "../utils/logger";

import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

logger.info("Starting opentelemetry tracing");

console.log(process.env.SERVICE_NAME);
const resource = resourceFromAttributes({
	[SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME,
});

const sdk = new NodeSDK({
	traceExporter: new JaegerExporter({
		endpoint: process.env.TRACE_URL,
	}),
	instrumentations: [getNodeAutoInstrumentations()],
	resource,
});

sdk.start();
