// import winston from "winston";
// import chalk from "chalk";
// import "winston-daily-rotate-file";
// import util from "util";

// // Destructure necessary formatters from Winston
// const { combine, timestamp, printf, errors } = winston.format;

// // Define colors for log levels and messages
// const levelColors: Record<string, chalk.Chalk> = {
// 	error: chalk.bold.red, // Bright red for errors
// 	warn: chalk.hex("#FFA500"), // Orange for warnings
// 	info: chalk.blue, // Blue for information
// 	debug: chalk.green, // Green for debugging
// 	default: chalk.white, // Default color for others
// };

// const messageColors: Record<string, chalk.Chalk> = {
// 	error: chalk.redBright, // Highlight error messages
// 	warn: chalk.yellowBright, // Bright yellow for warnings
// 	info: chalk.cyan, // Cyan for information messages
// 	debug: chalk.magentaBright, // Bright magenta for debugging
// 	default: chalk.gray, // Default gray for fallback
// };

// // Custom log format
// const logFormat = printf(({ level, message, timestamp, stack }: any) => {
// 	const levelColor = levelColors[level] || levelColors.default; // Colorize level
// 	const messageColor = messageColors[level] || messageColors.default; // Colorize message

// 	const coloredLevel = levelColor(`[${level.toUpperCase()}]`); // Apply color to log level
// 	const coloredTimestamp = chalk.dim(timestamp); // Dim timestamp
// 	const coloredMessage = messageColor(message); // Apply message-specific color
// 	const coloredStack = stack ? chalk.dim(stack) : ""; // Dim stack trace if present

// 	return `${coloredTimestamp} ${coloredLevel}: ${coloredMessage} ${coloredStack}`;
// });

// // Determine log level based on environment
// const logLevel = process.env.NODE_ENV === "production" ? "info" : "debug";

// // Configure Winston logger
// const winstonLogger = winston.createLogger({
// 	level: logLevel,
// 	format: combine(
// 		timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
// 		errors({ stack: true }), // Include stack trace in error messages
// 		logFormat
// 	),
// 	transports: [
// 		// Console transport with colorized output
// 		new winston.transports.Console(),
// 		new winston.transports.DailyRotateFile({
// 			dirname: "logs", // Log files directory
// 			filename: "application-%DATE%.log", // Log file naming pattern
// 			datePattern: "YYYY-MM-DD", // Date pattern for log file rotation
// 			maxFiles: "30d", // Retain logs for 30 days
// 			zippedArchive: true, // Compress archived log files
// 		}),
// 	],
// });

// // Create a custom logger with methods that accept multiple arguments
// const logger = {
// 	info: (...args: any[]) => {
// 		winstonLogger.info(util.format(...args));
// 	},
// 	warn: (...args: any[]) => {
// 		winstonLogger.warn(util.format(...args));
// 	},
// 	error: (...args: any[]) => {
// 		winstonLogger.error(util.format(...args));
// 	},
// 	debug: (...args: any[]) => {
// 		winstonLogger.debug(util.format(...args));
// 	},
// 	// You can add more methods if needed (e.g., verbose, silly)
// };

// export default logger;

import winston from "winston";
import chalk from "chalk";
import LokiTransport from "winston-loki";
import { LogParams } from "../types/log-params";

const { combine, timestamp, printf, errors } = winston.format;

// Define colors for log levels and messages
const levelColors: Record<string, chalk.Chalk> = {
  error: chalk.bold.red, // Bright red for errors
  warn: chalk.hex("#FFA500"), // Orange for warnings
  info: chalk.blue, // Blue for information
  debug: chalk.green, // Green for debugging
  default: chalk.white, // Default color for others
};

const messageColors: Record<string, chalk.Chalk> = {
  error: chalk.redBright, // Highlight error messages
  warn: chalk.yellowBright, // Bright yellow for warnings
  info: chalk.cyan, // Cyan for information messages
  debug: chalk.magentaBright, // Bright magenta for debugging
  default: chalk.gray, // Default gray for fallback
};

// Custom log format
const logFormat = printf(
  ({ level, message, timestamp, stack, transaction_id, ...meta }) => {
    const levelColor = levelColors[level] || levelColors.default; // Colorize level
    const messageColor = messageColors[level] || messageColors.default; // Colorize message

    const coloredLevel = levelColor(`[${level.toUpperCase()}]`); // Apply color to log level
    const coloredTimestamp = chalk.dim(timestamp); // Dim timestamp
    const coloredMessage = messageColor(message); // Apply message-specific color
    const coloredStack = stack ? chalk.dim(stack) : ""; // Dim stack trace if present
    const coloredtransaction_id = transaction_id
      ? chalk.yellow(`[${transaction_id}] `)
      : ""; // Yellow for transaction ID
    const coloredMeta =
      meta && Object.keys(meta).length > 0
        ? chalk.gray(JSON.stringify(meta))
        : "";
    return `${coloredTimestamp} ${coloredtransaction_id}${coloredLevel}: ${coloredMessage} ${coloredStack} ${coloredMeta}`;
  }
);

// Determine log level based on environment
const logLevel = process.env.NODE_ENV === "production" ? "info" : "debug";

// Configure Winston logger
const logger = winston.createLogger({
  level: logLevel,
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // Include stack trace in error messages
    logFormat
  ),
  transports: [
    // Console transport with colorized output
    new winston.transports.Console(),

    // Loki transport for sending logs to Grafana Loki
    // new LokiTransport({
    // 	host: process.env.LOKI_HOST || "http://localhost:3100", // Loki endpoint
    // 	labels: {
    // 		app: process.env.APP_NAME || "automation", // Custom label for filtering in Loki
    // 		env: process.env.NODE_ENV || "development",
    // 	},
    // 	json: true, // Send logs in JSON format
    // 	onConnectionError: (err) => console.error("Loki connection error:", err), // Handle connection errors
    // }),
  ],
});

// Logging functions
const logInfo = ({ message, transaction_id, meta }: LogParams): void => {
  logger.info(message, { transaction_id });
};

const logDebug = ({ message, transaction_id, meta }: LogParams): void => {
  logger.debug(message, { transaction_id });
};

const logError = ({
  message,
  transaction_id,
  error,
  meta,
}: LogParams): void => {
  if (error instanceof Error) {
    logger.error(message, { transaction_id, stack: error.stack, ...meta });
  } else {
    logger.error(message, { transaction_id, ...meta });
  }
};

export { logger, logInfo, logDebug, logError };
