import { getMessages, sendmessage } from "@/controllers/messageController";
import { IsAuth } from "@/middleware/isAuth";
import { Router } from "express";


const messageRoutes = Router();

messageRoutes.post('/', IsAuth, sendmessage);
messageRoutes.get('/:chat_id', IsAuth, getMessages);


export default messageRoutes;