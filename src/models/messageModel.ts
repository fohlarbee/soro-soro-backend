import mongoose, { Document } from "mongoose"


interface MessageDocument extends Document{
    sender:any,
    content:string,
    chat:any,
    voiceNote?: string, // Optional voice note attribute
    image?: string, // Optional image attribute
    file?: string, // Optional file attribute
}
// Define the message schema
const messageSchema = new mongoose.Schema<MessageDocument>({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    voiceNote: { type: String }, // Define voice note attribute
    image: { type: String }, // Define image attribute
    file: { type: String }, // Define file attribute
  }, { timestamps: true });
  
  // Create the message model
  const MessageModel = mongoose.model<MessageDocument>('Message', messageSchema);
  
  // Export the message model
  export default MessageModel;
 