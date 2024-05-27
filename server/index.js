import express from 'express';
import dotenv from 'dotenv';
import DBConnection from './database/db.js';
import auth from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';    
import generateFile from './generateFile.cjs';


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

// app.post('/run', (req, res) => {
//     try{
//     const {language = "cpp", code} = req.body;
//     if(code === undefined) return res.status(400).json({success:false, error: "Empty code body"});

//     const filePath = generateFile(language, code);
//     res.json({language, code});
//     }catch(err){
//         res.status(500).json({success:false, error: err.message});
//     }
// });

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








