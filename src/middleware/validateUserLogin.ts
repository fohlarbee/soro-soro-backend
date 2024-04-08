import { RequestHandler } from "express";
import validator from "validator";

const userLoginAuth: RequestHandler = (req, res, next) => {
    const{ username,password} = req.body;
   

    try {
        if(!username || !password){
            return res.status(401).json({success:false, mssg:'All inputs should be filled'})
        }

        if(!validator.isStrongPassword(password))
            return res.status(400).json({success:false, mssg:'Not strong password'})

        
    } catch (error) {
        if(error instanceof Error)
            return res.status(400).json({success:false, mssg:'Error in signin middleware'})
        
    }

    next();

}

export default userLoginAuth;