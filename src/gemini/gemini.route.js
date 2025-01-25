import { Router } from "express";
import { handleCommand, fetchAllInteractions, handleVoiceCommand } from "./gemini.controller.js";
import { upload } from "../../middleware/multer.js";

export const geminiRouter = Router();

geminiRouter.post("/process-command", handleCommand);
geminiRouter.get("/interactions", fetchAllInteractions);
geminiRouter.post("/voice-command", upload.single('audioFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No audio file uploaded' });
    }

    try {
        const transcription = await handleVoiceCommand(req.file);
        res.status(200).json({ transcription });
    } catch (error) {
        console.error("Error processing voice command:", error);
        res.status(500).json({ error: "Error processing voice command" });
    }
});


