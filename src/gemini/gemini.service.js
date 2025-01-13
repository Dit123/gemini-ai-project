import { GoogleGenerativeAI, } from "@google/generative-ai";
import { executeQuery } from "../config.js/database.js";
import { config } from "../config.js/env.js";
import fs from "fs";

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


export const recognizeSpeech = async (audioFilePath) => {
    try {
        const audio = {
            content: fs.readFileSync(audioFilePath).toString('base64'),
        };

        const config = {
            encoding: 'LINEAR16', 
            sampleRateHertz: 16000,
            languageCode: 'en-US', 
        };

        const request = {
            audio: audio,
            config: config,
        };

        const [response] = await client.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        
        console.log('Transcription: ', transcription);
        return transcription; 
    } catch (error) {
        console.error("Error recognizing speech:", error);
        throw new Error("Error recognizing speech");
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


export const getAllInteractions = async (page = 1, limit = 10) => {
    try {
        const offset = (page - 1) * limit;
        const query = `
            SELECT * FROM interactions
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?;
        `;
        return await executeQuery(query, [limit, offset]);
    } catch (error) {
        console.error("Error fetching interactions:", error);
        throw new Error("Error fetching interactions");
    }
};

