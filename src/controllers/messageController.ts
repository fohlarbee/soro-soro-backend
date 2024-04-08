import ChatModel from "@/models/chatModel";
import MessageModel from "@/models/messageModel";
import userModel from "@/models/userModel";
import { RequestHandler } from "express";
import mongoose from "mongoose";

export const sendmessage: RequestHandler = async(req, res, next) => {

    try {
        const {content, chat_id} = req.body;

        if(!content || !chat_id){
            return res.status(400).json({success:false, mssg:'Invalid data passed into request'})
    
        }
        if(!mongoose.Types.ObjectId.isValid(chat_id)){
            return res.status(401).json({success:false, mssg:'Invalid chat id'})
        };

        let newMessageData = new MessageModel({
            sender:req.user?._id,
            content:content,
            chat:chat_id
        });

        let newMessage: any
        newMessage = await newMessageData.save();
        newMessage = await newMessage.populate('sender', 'email username');
        newMessage = await newMessage.populate('chat');
        newMessage = await userModel.populate(newMessage, {
            path:'chat.users',
            select:'username email'
        });

        await ChatModel.findByIdAndUpdate(req.body.chat_id, {
            latestMessage:newMessage
        });
        return res.status(201).json({success:true, mssg:"New message added", data: newMessage})

        
    } catch (error) {
        if(error instanceof Error){
            return res.status(400).json({success:false, mssg:'unable to send message'})
        }
        
        
    }
    

}


export const getMessages: RequestHandler = async(req, res, next) => {
    try {
    
        if( !req.params.chat_id){
            return res.status(400).json({success:false, mssg:'Invalid data passed into request'})
    
        }
        if(!mongoose.Types.ObjectId.isValid(req.params.chat_id)){
            return res.status(401).json({success:false, mssg:'Invalid chat id'})
        };


        const messages = await MessageModel.find({chat:req.params.chat_id})
        .populate('sender', 'username email')
        .populate('chat');
        
        return res.status(200).json({success:true, mssg:'Messages fetched', data:messages})
    } catch (error) {
        if(error instanceof Error){
            return res.status(400).json({success:false, mssg:'unable to fetch all messages for this chat'})
        }
    }
    next()
}