import { NextFunction, Request, Response } from "express";
import { Client } from "whatsapp-web.js";
import { OpenAIApi, ChatCompletionRequestMessage } from "openai";
import { configureOpenAI } from "../config/openai-config.js";
import User from "../models/User.js";

const runCompletion = async(openai,whatsAppChats) => {
    const completion  = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: whatsAppChats,
      });
    return completion.data.choices[0].message;
}

export const getQRCode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        
        const user = await User.findById(res.locals.jwtData.id);
        if (!user)
            return res
                .status(401)
                .json({ message: "User not registered or Token malfunctioned" });
    
        const client = 
            new Client({});
        const config = 
            configureOpenAI();
        const openai = 
            new OpenAIApi(config);

        
        const qrCodePromise = new Promise((resolve, reject) => {
            client.on('qr', (qr) => {
                console.log(`in client on: ${qr}`);
                resolve(qr);
            });
        });
        
        client.initialize();

        const whatsAppChats = user.whatsAppChats.map(({ role, content }) => ({
            role,
            content,
        })) as ChatCompletionRequestMessage[];
        

        client.on('message', message => {
            whatsAppChats.push({ content: message.body, role: "user" });
            user.whatsAppChats.push({ content: message.body, role: "user" });

            console.log(message.body);
            runCompletion(openai,whatsAppChats).then(result =>{
                message.reply(result.content);
                user.whatsAppChats.push(result);
            });
        })
        
        const qrCodeString = await qrCodePromise;

        client.on('disconnected', reason => {
            console.log(`disconnect reason ${reason}`);
            //@ts-ignore
            user.whatsAppChats = []
        })
        
        await user.save();

        console.log(`returning : ${qrCodeString}`);
        return res.status(200).json({ message: "OK" , qrCode : qrCodeString});
    } catch (error) {
      console.log(error);
      return res.status(200).json({ message: "ERROR", cause: error.message });
    }
  };