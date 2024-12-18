import express from 'express';
import path from 'path';
import { config } from './config.js/env.js';
import { createInteractionsTable } from './gemini/gemini.model.js';
import { geminiRouter } from './gemini/gemini.route.js';


const app = express();

const __dirname = path.resolve();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/gemini', geminiRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(config.port, async () => {
    await createInteractionsTable();
    console.log(`server running on port`, config.port)
});