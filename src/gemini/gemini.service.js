import { GoogleGenerativeAI } from "@google/generative-ai";
import { executeQuery } from "../config.js/database.js";
import { config } from "../config.js/env.js";

const genAI = new GoogleGenerativeAI(config.googleApiKey); 
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export const interactWithGemini = async (prompt) => {
    try {
        const result = await model.generateContent(prompt); 
        return result.response.text();
    } catch (error) {
        console.error("Error interacting with Gemini:", error);
        throw new Error("Failed to interact with Gemini");
    }
};


export const processCommand = async (command) => {
    try {
        
        const response = await interactWithGemini(command);

        
        const query = `
            INSERT INTO interactions (command, response) 
            VALUES (?, ?)
        `;
        const values = [command, response];
        await executeQuery(query, values);

        return response;
    } catch (error) {
        console.error("Error processing command:", error);
        throw new Error("Error processing command");
    }
};


export const getAllInteractions = async () => {
    try {
        const query = "SELECT * FROM interactions";
        return await executeQuery(query, []);
    } catch (error) {
        console.error("Error fetching interactions:", error);
        throw new Error("Error fetching interactions");
    }
};
