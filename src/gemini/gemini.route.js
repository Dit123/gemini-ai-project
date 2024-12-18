import {Router} from "express";
import { handleCommand, fetchAllInteractions, askGeminiQuestion } from "./gemini.controller.js";

export const geminiRouter = Router();

geminiRouter.post("/process-command", handleCommand);
geminiRouter.get("/interactions", fetchAllInteractions);
geminiRouter.post("/ask", askGeminiQuestion);
