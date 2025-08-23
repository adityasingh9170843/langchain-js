import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateResponse } from "./chatBot.js";


const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173","https://agent-ruby-two.vercel.app/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    
}));

const port = 3000


app.post('/chat',async(req,res)=>{
    const {message,ConversationID} = req.body

    const response = await generateResponse(message,ConversationID)

    res.json({message:response})
})



app.listen(port,()=>{
    console.log(`Server is running on port : ${port}`);
})