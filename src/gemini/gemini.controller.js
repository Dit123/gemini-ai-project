import { response } from "express";
import { processCommand, getAllInteractions, recognizeSpeech } from "./gemini.service.js";


export const handleCommand = async (req, res) => {
    const { command } = req.body;

    if (!command) {
        return res.status(400).json({ message: "Command is required" });
    }

    try {
        const response = await processCommand(command);
        return res.status(200).json({ command, response });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const fetchAllInteractions = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;  
    try {
        const interactions = await getAllInteractions(page, limit); 
        return res.status(200).json({ interactions });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const handleVoiceCommand = async (req, res) => {
    const { audioFile } = req.files; 

    if (!audioFile) {
        return res.status(400).json({ message: "Audio file is required" });
    }

    try {
        const recognizedText = await recognizeSpeech(audioFile.path); 
        const response = await processCommand(recognizedText);

        return res.status(200).json({ recognizedText, response });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ message: "Error processing voice command" });
    }
};
