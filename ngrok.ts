import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { logger } from "./src/utils/logger";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post("/", (req: any, res: any) => {
  res.send({ success: true });
});

const PORT = process.env.PORT || 4040;

app.listen(PORT, () => {
  logger.info(`Ngrok server running at ${PORT}`);
});
