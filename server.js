import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateResponse } from "./chatBot.js";


const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    
}));

const port = 3000


app.post('/chat',async(req,res)=>{
    const {message} = req.body

    const response = await generateResponse(message)

    res.json({message:response})
})



app.listen(port,()=>{
    console.log(`Server is running on port : ${port}`);
})