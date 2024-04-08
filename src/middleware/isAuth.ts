import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { RequestHandler, Response, NextFunction, Request } from "express";
import UserModel from '../models/userModel';
import env from '@/lib/env';

declare global {
    namespace Express {
        interface Request {
            user: {
                [key: string]: any
            }
        }
    }
}



export const IsAuth: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(req.headers && req.headers.authorization){
            const authToken = req.headers.authorization;
        if (!authToken) {
            return res.status(401).json({ success: false, mssg: 'Please login to continue' })
        }
        const token = authToken?.split('Bearer ')[1]
        // console.log('This is token',token)
        if (!token)
            return res.status(403).json({ success: false, mssg: "Unauhorized access" })
        // console.log(token)
        
        const payload = jwt.verify(token, env.SECRET_TOKEN_KEY) as {id: string}
        if(!payload) return res.status(404).json({success: false, message:'No payload found'})
    
        // console.log(payload)
        const user = await UserModel.findById(payload.id)
        // console.log(user)
        if (!user) {
            return res.status(403).json({ success: false, mssg: "Unauthorized access" })
        }
        req.user = user!
        // console.log({success:true, mssg: user?._id})


//         SECRET_TOKEN_KEY=sorosoroismeantforeveryone@@@bearer_token
// SECRET_TOKEN_EXPIRY=2d
// REFRESH_SECRET_KEY=sorosoroismeantforeveryone@@@refresh_token
// REFRESH_SECRET_EXPIRY=1y

        }
        



    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            return res.status(404).json({ success: false, mssg: error.message })

        }
        else {
            return res.status(403).json({ success: false, mssg: "something went wrong" })
        }
    }

    next();

}