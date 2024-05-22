import express from 'express';
import dotenv from 'dotenv';
import DBConnection from './database/db.js';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
DBConnection();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Welcome to OJ server!");
});

// Routes
app.use('/api/auth', authRoutes);
app.post('/test', (req, res) => {
    console.log(req.body);  // Should print the body content to the console
    res.send(req.body);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
});




