import { executeQuery } from "../config.js/database.js";

export const createInteractionsTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS interactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                command VARCHAR(255) NOT NULL,
                response TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`;

        await executeQuery(query, []);
    } catch (error) {
        console.log("Error creating interactions table", error);
    }
};

