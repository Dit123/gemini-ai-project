import express from 'express';
import path from 'path';
import cors from 'cors';
import { config } from './config.js/env.js';
import { createInteractionsTable } from './gemini/gemini.model.js';
import { geminiRouter } from './gemini/gemini.route.js';


const app = express();

const __dirname = path.resolve();

app.use(cors());

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));  
  
app.use(express.json());

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/gemini', geminiRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
  
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
    }
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


/*app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});*/

app.listen(config.port, async () => {
    await createInteractionsTable();
    console.log(`server running on port`, config.port)
});