import ChatModel from "@/models/chatModel";
import userModel from "@/models/userModel";
import { RequestHandler } from "express";
import mongoose from "mongoose";

// export const accessChat: RequestHandler = async(req, res, next) => {
//     try {

//          const {user_id} = req.body;

//         if(!user_id){
//             return res.status(400).json({success:false, mssg:'No user_id provided'});
//         };

//         if(!mongoose.Types.ObjectId.isValid(user_id)){
//             return res.status(401).json({success:false, mssg:'Invalid user id'})
//         };

//         let isChat : any = await ChatModel.find({
//             $and:[
//                 {users:{$elemMatch:{$eq:req.user?._id}}},
//                 {users:{$elemMatch:{$eq:user_id}}},
//             ]
//         }).populate('users', '-password').populate('latestMessage')

//         isChat = await userModel.populate(isChat, {
//             path:'latestMessage.sender',
//             select:'username email'
//         })

//         if(isChat.length > 0){
//             return res.status(200).json({success:true, mssg:"Chats feteched", data:isChat[0]})
//         }else{
            
//             const chatData = new ChatModel({
//                 chatName:`sender`,
//                 users:[req.user?._id, user_id],
//                 isGroupChat:false
//             })
//             const createdChat = await chatData.save();
//             console.log(createdChat)
            
//             const fullChat = await ChatModel.findOne({_id:createdChat._id}).populate('users', '-password');

//             return res.status(201).json({success:true, mssg:"Chat created", data:fullChat})
//         }
        
//     } catch (error) {
//         if(error instanceof Error){
//             return res.status(400).json({success:false, mssg:error.message})
//         }
        
//     }
//     next();

// };

export const fetchChats: RequestHandler = async(req,res, next) => {
    try {
        const chat = await ChatModel.find({users:{$elemMatch:{$eq:req.user?._id}}}).populate('users', '-password').populate('groupAdmin', '-password').populate('latestMessage').sort({updatedAt:-1}).then(async(results:any) => {
            results = await userModel.populate(results, {
                path:'lastestMessage.sender',
                select:'username email'
            });
           return res.status(200).json({success:true, mssg:'Mssg fetched succesfully', data:results})

        });
    } catch (error) {
        if(error instanceof Error){
            return res.status(400).json({success:false, mssg:'unable to ftech chats'})
        }     
    }
    next();
} 

export const createGroup: RequestHandler = async(req, res, next) => {
    try {
        if(!req.body.users || !req.body.name){
            return res.status(400).json({success:false, mssg:'invalid params'})
        }
        
        let users = req.body.users;

        users.push(req.user?._id);

        
        if(users.length < 2){
            return res.status(400).json({success:false, mssg:'Atleast two users are required to create a group'})

        }


        const newGroupChat = await ChatModel.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user?._id
        });

        const fullGroupChat = await ChatModel.findOne({_id:newGroupChat._id}).populate('users', '-password').populate('groupAdmin', '-password');

        return res.status(201).json({success:true, mssg:'Group chat created', data:fullGroupChat })

    } catch (error) {
        if(error instanceof Error){
            return res.status(400).json({success:false, mssg:error.message})
        }
        
    }
}

export const renameGroup: RequestHandler = async(req,res, next) => {

    try {
        const {chat_id, chatName} = req.body;
        if(!chat_id || !chatName ){
            return res.status(400).json({success:false, mssg:'Invalid request body'})
        }

        const updatedChat = await ChatModel.findByIdAndUpdate(chat_id, {
            chatName
        },{new:true}).populate('users', '-password').populate('groupAdmin', '-password');

        if(!updatedChat) return res.status(401).json({success:false, mssg:'No such chat'});

        return res.status(200).json({success:true, mssg:'chat renamed successfully', data:updatedChat})


        
    } catch (error) {
        if(error instanceof Error){
            return res.status(400).json({success:false, mssg:error.message})
        }
        
    }
}


export const addToGroup: RequestHandler = async(req,res, next) => {
    try {
        const {chat_id, user_id} = req.body;

        if(!chat_id || !user_id ){
            return res.status(400).json({success:false, mssg:'Invalid request body'})
        }

        const add = await ChatModel.findByIdAndUpdate(chat_id, {
            $push:{users:user_id},
        }, {new:true}).populate('users', '-password').populate('groupAdmin', '-password');

        if(!add) return res.status(400).json({success:false, mssg:'something went wrong'});

        return res.status(200).json({success:true, mssg:'User added to group', data:add})
        
    } catch (error) {
        if(error instanceof Error){
            return res.status(400).json({success:false, mssg:error.message})
        }
        
        
    }
    
}
export const removeFromGroup: RequestHandler = async(req,res, next) => {
    try {
        const {chat_id, user_id} = req.body;

        if(!chat_id || !user_id ){
            return res.status(400).json({success:false, mssg:'Invalid request body'})
        }

        const remove = await ChatModel.findByIdAndUpdate(chat_id, {
            $pull:{users:user_id},
        }, {new:true}).populate('users', '-password').populate('groupAdmin', '-password');

        if(!remove) return res.status(400).json({success:false, mssg:'something went wrong'});

        return res.status(200).json({success:true, mssg:'User removed from group', data:remove})
        
    } catch (error) {
        if(error instanceof Error){
            return res.status(400).json({success:false, mssg:error.message})
        }
        
        
    }
}


export const accessChat: RequestHandler = async(req, res, next) => {
    try {

         const {user_id} = req.body;

        if(!user_id){
            return res.status(400).json({success:false, mssg:'No user_id provided'});
        };

        if(!mongoose.Types.ObjectId.isValid(user_id)){
            return res.status(401).json({success:false, mssg:'Invalid user id'})
        };
        

        let isChat : any = await ChatModel.find({
            $and:[
                {users:{$elemMatch:{$eq:req.user?._id}}},
                {users:{$elemMatch:{$eq:user_id}}},
                {isGroupChat:false}
            ]
        }).populate('users', '-password').populate('latestMessage')

        isChat = await userModel.populate(isChat, {
            path:'latestMessage.sender',
            select:'username email'
        })

        if(isChat.length > 0){
            return res.status(200).json({success:true, mssg:"Chats feteched", data:isChat[0]})
        }else{
            
            const chatData = new ChatModel({
                chatName:`chat${req.user?._id}_${user_id}`,
                users:[req.user?._id, user_id],
            })
            const createdChat = await chatData.save();
            // console.log(createdChat)
            
            const fullChat = await ChatModel.findOne({_id:createdChat._id}).populate('users', '-password');

            return res.status(201).json({success:true, mssg:"Chat created", data:fullChat})
        }
        
    } catch (error) {
        if(error instanceof Error){
            return res.status(400).json({success:false, mssg:error.message})
        }
        
    }
    next();
}
    
