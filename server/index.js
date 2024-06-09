import express from 'express';
import dotenv from 'dotenv';
import DBConnection from './database/db.js';
import auth from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';    
import generateFile from './generateFile.mjs';
import execute  from './execute.mjs';
import {submission} from "./submissionController.js"

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
    res.send("Welcome to OJ server!");
});

app.post("/run", async (req, res) => {
    try {
        const { lang = "cpp", code, input = [] } = req.body;
        if (!code) {
          return res.status(400).send({ success: false, message: "[Code is Missing]" });
        }

        const inputArray = Array.isArray(input) ? input : [input];

        const filepath = await generateFile(lang, code);
      
        const output = await execute(filepath, lang, inputArray);

        return res.status(200).json({
          success: true,
          message: "Successful",
          filepath,
          output,
        });
      } catch (err) {
        if (err.status == 1) {
          return res.status(400).send({
            success: false,
            message: "Compilation Failed",
            error: err,
          });
        }
        if (err.status == 2) {
          return res.status(401).send({
            success: false,
            message: "Execution Failed",
            error: err,
          });
        }
        return res.status(500).send({
          success: false,
          message: "Internal Server Error",
          error: err.message,
        });
      }
});

app.post("/submit", submission);


// Routes
import authenticateToken from "./middlewares/authMiddleware.js";

app.use('/api/auth', auth);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/problems', authenticateToken, problemRoutes);
app.use('/api/submissions', authenticateToken, submissionRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
});








