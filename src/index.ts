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
let corsOptions = {
    origin: [ 'http://localhost:5173', 'http://localhost:3000', '*' ]
};
const PORT = process.env.PORT
const app = express()
app.use(express.json())
app.use('/api/v1/user' , router)
app.use(cors(corsOptions))
app.get('/' , (req, res)=>{

    
})

app.listen(PORT , ()=>{
    console.log(`server is running at ${PORT}`)
})