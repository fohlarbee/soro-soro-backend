import mongoose, { Document } from "mongoose"


export interface UserDocument extends Document{
    username:string,
    email:string,
    password:string,
    phone: number,
    avatar: string,
    authProvider:string
   
}
// Define the message schema
const userSchema = new mongoose.Schema<UserDocument>({
    username: { type: String , required:true, unique:true},
    email: { type: String, trim: true, required:true, unique:true},
    password: { type: String },
    phone:{type: Number},
   avatar:{type:String, default:'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-png%2Fprofile&psig=AOvVaw33NpOs73n9lQFMLC8hnrRc&ust=1711546716552000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCKjTxsaGkoUDFQAAAAAdAAAAABAE'},
   authProvider:{type:String, default:'soro-soro-web'}
  }, { timestamps: true });
  
  // Create the message model
  const userModel = mongoose.model<UserDocument>('User', userSchema);
  
  // Export the message model
  export default userModel;
