import express from 'express';
import dotenv from 'dotenv'
import z from 'zod'
import router from './routes/auth.route';
import { connectDB } from './db/database';
import cors from "cors";
dotenv.config({
    path:'./.env'
})
connectDB()

const PORT = process.env.PORT
const app = express()

// Define allowed origins (without the trailing slash)
const allowedOrigins = [
    "http://localhost:5173",  // No trailing slash
      // No trailing slash
    // Add more allowed origins here
];

// CORS middleware should be configured before routes
app.use(cors({
    origin: allowedOrigins,  // Allow specified origins
    credentials: true,       // Allow cookies or HTTP authentication
    methods: ["GET", "POST", "PUT", "DELETE"],  // Allowed methods
}));

app.use(express.json())
app.use('/api/v1/user' , router)

app.get('/' , (req, res)=>{

    
})

app.listen(PORT , ()=>{
    console.log(`server is running at ${PORT}`)
})