import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 5005,
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    googleApiKey: process.env.GOOGLE_API_KEY
};