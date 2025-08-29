import { Router } from "express";
import { getMockConfigController } from "../controllers/configController";

const configRouter = Router();

configRouter.get("/mock-actions", getMockConfigController);

export default configRouter;
