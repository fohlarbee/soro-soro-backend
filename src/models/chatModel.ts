import mongoose, { Document } from "mongoose"

interface ChatDocument extends Document{
    chatName:string,
    users:any,
    latestMessage:any,
    isGroupChat: boolean,
    groupAdmin: any
}

const ChatSchema = new mongoose.Schema<ChatDocument>({
    chatName:{type:String, trim:true},
    users:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    latestMessage:{type:mongoose.Schema.Types.ObjectId, ref:"Message"},
    isGroupChat:{type: Boolean, default: false},
    groupAdmin: {type:mongoose.Schema.Types.ObjectId, ref:'User'}
}, {timestamps:true});

const ChatModel = mongoose.model<ChatDocument>('Chat', ChatSchema);

export default ChatModel;