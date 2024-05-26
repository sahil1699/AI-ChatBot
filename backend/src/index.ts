import {config } from "dotenv";
import express from "express";
import { connectToMongoDB } from "./connections/mongodbConnection.js";
import { error } from "console";
import userRouter from "./routes/user-router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import chatRoutes from "./routes/chat-routes.js";
import whatsappRoutes from "./routes/whatsapp-routes.js";
config();

const app = express();

//middlewares
app.use(cors({origin:"http://localhost:5173", credentials : true}))
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/user",userRouter);
app.use("/chat",chatRoutes);
app.use("/whatsapp",whatsappRoutes);

app.use("/",(req,res,next)=>{
    return res.status(200).json({message:"listing"});
});


connectToMongoDB().then(() => {
    app.listen(process.env.PORT,()=>
        console.log("Server is started and Connected to Database")
    );
}).catch((error)=> console.error(error));


