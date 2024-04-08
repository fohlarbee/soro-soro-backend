import { accessChat, addToGroup, createGroup, fetchChats, removeFromGroup, renameGroup } from "@/controllers/chatController";
import { IsAuth } from "@/middleware/isAuth";
import { Router } from "express";

const chatRoutes = Router()

chatRoutes.post('/', IsAuth, accessChat)
chatRoutes.get('/', IsAuth, fetchChats)
chatRoutes.post('/group', IsAuth, createGroup);
chatRoutes.put('/renamegroup', IsAuth, renameGroup)
chatRoutes.put('/removefromgroup', IsAuth, removeFromGroup)
chatRoutes.put('/addtogroup', IsAuth, addToGroup)


export default chatRoutes