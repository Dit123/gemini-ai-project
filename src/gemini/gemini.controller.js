import { response } from "express";
import { processCommand, getAllInteractions, interactWithGemini } from "./gemini.service.js";


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
    try {
        const interactions = await getAllInteractions();
        return res.status(200).json({ interactions });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
 

export const askGeminiQuestion = async (req, res) => {
    const { question } = req.body; 
    if (!question) {
        return res.status(400).json({ error: "Question is required" });
    }

    try {
        const response = await interactWithGemini(question);
        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ error: "Failed to process the question" });
    }
}