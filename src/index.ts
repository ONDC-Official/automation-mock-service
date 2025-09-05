import { config } from "./config/serverConfig";
import createServer from "./server";
import { logInfo } from "./utils/logger";
import { RedisService } from "ondc-automation-cache-lib";

const app = createServer();
RedisService.useDb(0);

const server = app.listen(config.port, () => {
	logInfo({message: 
		`Server running on port ${config.port} in ${config.environment} mode`}
	);
});

// Graceful Shutdown
process.on("SIGTERM", () => {
	logInfo({message: "SIGTERM signal received: closing HTTP server"});
	server.close(() => {
		logInfo({message: "HTTP server closed"});
	});
});

process.on("SIGINT", () => {
	logInfo({message: "SIGINT signal received: closing HTTP server"});
	server.close(() => {
		logInfo({message: "HTTP server closed"});
	});
});
