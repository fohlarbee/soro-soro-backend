import { RequestHandler } from "express";
import userModel from "../models/userModel";
import { compare, genSalt, hash } from "bcrypt";

import jwt from 'jsonwebtoken'
import env from "../lib/env";
import { getGoogleOauthTokens, getGoogleUser } from "../services/userAuth.service";
import { jwtDecode } from "jwt-decode";


export const signup:RequestHandler = async(req, res, next) => {
    try {
       const {username, password, email, avatar} = req.body;
        const userExists = await userModel.findOne({$or:[{email}, {username}]})

        if(userExists){
            return res.status(409).json({success:false,  mssg: 'Username or phone already in use'})
        }
       
        const salt = await genSalt(10);

        const hashedPassword = await hash(password, salt);


        const user = await userModel.create({ ...req.body, password: hashedPassword, authProvider:'soro-soro-web'});

        const newUser = await userModel.findById(user._id, '-password')


        return res.status(201).json({ success: true, mssg: 'User created Successfully', data: newUser })
    
    } catch (error:any) {
        if (error instanceof Error)
        return res.status(401).json({ success: false, mssg: error.message })
        
    }

    next();

};


export const signin: RequestHandler = async(req,res, next) => {

    try {
        const {username, password} = req.body;

        const user = await userModel.findOne({username});
    if(!user)
      return res.status(404).json({success: false, mssg:'No user exits'});
    // console.log(user)
 
      
     const isMatched = await compare(password, user?.password!)
    //  console.log(isMatched)

    if(!isMatched)
       return res.status(403).json({success:false, mssg:'Wrong credentials'})

    const bearer_token =   jwt.sign({id: user?._id.toString()}, env.SECRET_TOKEN_KEY, {
        expiresIn:env.SECRET_TOKEN_EXPIRY,
        issuer:'sorosoro.chat',
    })
    const refresh_token =  jwt.sign({id: user?._id.toString()}, env.REFRESH_SECRET_KEY, {
        expiresIn:env.REFRESH_SECRET_EXPIRY,
        issuer:'sorosoro.chat',
    })
    

        // return res.status(200).json({ success: true, mssg: "User signed in", data: { user, bearer_token, refresh_token } })
   return res.cookie('Bearer', bearer_token).status(200).json({success:true, mssg:"User signed in" , data: {user, Bearer:bearer_token, refresh_token:refresh_token}})

        
    } catch (error:any) {
        if (error instanceof Error)
        return res.status(401).json({ success: false, mssg:error.message })

        
    }

    next();

}

export const googleOauth: RequestHandler = async(req,res, next) => {
    try {

        const {code} = req.body;
        // console.log('from backend', code)

        // get the id and access token from qs
        const {id_token, access_token} = await getGoogleOauthTokens({code});
    
    
        //get user with tokens
        const googleUser = await getGoogleUser({id_token, access_token});

        if(googleUser.email_verified === false){
            return res.status(403).json({success:false, mssg:"Google account not verified"})           
        }
        //check if email exist in db
        const userExists = await userModel.findOne({email:googleUser.email});

        if(userExists && userExists.authProvider === 'soro-soro-web'){
            return res.status(403).json({success:false, mssg:'Email already in use'})
        }else if(userExists && userExists.authProvider === 'google'){
            
            const user = await userModel.findOne({email:googleUser.email});
            if(!user)
              return res.status(404).json({success: false, mssg:'No user exits'});
        
            const bearer_token =   jwt.sign({id: user?._id.toString()}, env.SECRET_TOKEN_KEY, {
                expiresIn:env.SECRET_TOKEN_EXPIRY,
                issuer:'sorosoro.chat',
            })
            const refresh_token =  jwt.sign({id: user?._id.toString()}, env.REFRESH_SECRET_KEY, {
                expiresIn:env.REFRESH_SECRET_EXPIRY,
                issuer:'sorosoro.chat',
            })
            res.cookie('Bearer', bearer_token)

            // res.redirect('http://localhost:3000/chats', 200, {})
            // return res.json({ success:true, mssg:"User signed in" , data: {user, Bearer:bearer_token, refresh_token:refresh_token}}).redirect('http://localhost:3000/chats')
            
        //    return res.cookie('Bearer', bearer_token).status(200).json({success:true, mssg:"User signed in" , data: {user, Bearer:bearer_token, refresh_token:refresh_token}}).redirect('http://localhost:3000/chats')
        
        }else{
            const newUserDocs = new userModel({
                email:googleUser.email,
                username:googleUser.given_name,
                authProvider:'google',
                avatar:googleUser.picture
                
            });
            const newUser = await newUserDocs.save();
            // console.log('one', newUser)
    
            const refresh_token =  jwt.sign({id: newUser?._id.toString()}, env.REFRESH_SECRET_KEY, {
                expiresIn:env.REFRESH_SECRET_EXPIRY,
                issuer:'sorosoro.chat',
            })
    
            const bearer_token =  jwt.sign({id: newUser?._id.toString()}, env.SECRET_TOKEN_KEY, {
                expiresIn:env.SECRET_TOKEN_EXPIRY,
                issuer:'sorosoro.chat',
            })
        
            return res.status(201).json({success:true, mssg:'User created Succesfully', data:{newUserDocs, Bearer:bearer_token, refresh_token:refresh_token}}).redirect('http://loacalhost:3000/chats')

        }
    
    } catch (error) {
        
    }
    next();
}


export const googleAuth : RequestHandler = async(req, res, next) => {

    try {
        const {code} = req.body;
        console.log(code)


        
      

        const {id_token, access_token} = await getGoogleOauthTokens({code});
        const googleUser = await getGoogleUser({id_token, access_token});

        if(googleUser.email_verified === false){
            return res.status(403).json({success:false, mssg:"Google account not verified"})           
        }
        //check if email exist in db
        const userExists = await userModel.findOne({email:googleUser.email});

        if(userExists && userExists.authProvider === 'soro-soro-web'){
            return res.status(403).json({success:false, mssg:'Email already in use'})
        }else if(userExists && userExists.authProvider === 'google'){
            
            const user = await userModel.findOne({email:googleUser.email});
            if(!user)
              return res.status(404).json({success: false, mssg:'No user exits'});
        
            const bearer_token =   jwt.sign({id: user?._id.toString()}, env.SECRET_TOKEN_KEY, {
                expiresIn:env.SECRET_TOKEN_EXPIRY,
                issuer:'sorosoro.chat',
            })
            const refresh_token =  jwt.sign({id: user?._id.toString()}, env.REFRESH_SECRET_KEY, {
                expiresIn:env.REFRESH_SECRET_EXPIRY,
                issuer:'sorosoro.chat',
            })
            // res.cookie('Bearer', bearer_token)

            // res.redirect('http://localhost:3000/chats', 200, {})
            return res.json({ success:true, mssg:"User signed in" , data: {user, Bearer:bearer_token, refresh_token:refresh_token}})
            
        //    return res.cookie('Bearer', bearer_token).status(200).json({success:true, mssg:"User signed in" , data: {user, Bearer:bearer_token, refresh_token:refresh_token}}).redirect('http://localhost:3000/chats')
        
        }else{
            const newUserDocs = new userModel({
                email:googleUser.email,
                username:googleUser.given_name,
                authProvider:'google',
                avatar:googleUser.picture
                
            });
            const newUser = await newUserDocs.save();
            // console.log('one', newUser)
    
            const refresh_token =  jwt.sign({id: newUser?._id.toString()}, env.REFRESH_SECRET_KEY, {
                expiresIn:env.REFRESH_SECRET_EXPIRY,
                issuer:'sorosoro.chat',
            })
    
            const bearer_token =  jwt.sign({id: newUser?._id.toString()}, env.SECRET_TOKEN_KEY, {
                expiresIn:env.SECRET_TOKEN_EXPIRY,
                issuer:'sorosoro.chat',
            })
        
            return res.status(201).json({success:true, mssg:'User created Succesfully', data:{newUserDocs, Bearer:bearer_token, refresh_token:refresh_token}})

        }



       
        
    } catch (error) {
        
    }
}

export const getAllUsers: RequestHandler = async(req,res, next) => {

    try {

        let search: {[key: string]: any} = {};
        if(req.query.search){
            search.$or = [
                {username: {$regex: req.query.search, $options: 'i'}},
                {email:{$regex: req.query.search, $options: 'i'}},
               
            ]
        }
        const allUsers = await userModel.find(search).find({_id:{$ne:req.user?._id}}).sort({createdAt: -1});

        if(!allUsers){
            return res.status(401).json({success:false, mssg:'No users found'})
        }


      return res.status(200).json({success:true, mssg:'Users retrieved succesfully', users: allUsers});
        
    } catch (error) {
        if(error instanceof Error){
          return res.status(401).json({success:false, mssg:'An error occurred while retriving all users'})
        }
    }

    next()
}