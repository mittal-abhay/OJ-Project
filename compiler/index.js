import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';    
import {compiler}  from './controllers/compilerController.js';
import {submission} from "./controllers/submitController.js"
import DBConnection from "../server/database/db.js";

// Load environment variables
dotenv.config();
const app = express();


//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
DBConnection();

app.get('/', (req, res) => {
    res.send("Welcome to OJ compiler!");
});


// Routes
import authenticateToken from "../server/middlewares/authMiddleware.js";

app.post("/run", authenticateToken, compiler);
app.post("/submit", authenticateToken, submission);


const CPORT = process.env.CPORT || 8000;

app.listen(CPORT, () => {
    console.log(`Compiler is running on port ${CPORT}!`);
});








