import { RequestHandler } from "express";
import validator from "validator";

 const userSignUputh: RequestHandler = (req, res, next) => {
    const{ username,password, email, avatar} = req.body;
   

    try {
        if(!username || !avatar || !email || !password){
            return res.status(401).json({success:false, mssg:'All inputs should be filled'})
        }

        if(!validator.isStrongPassword(password))
            return res.status(400).json({success:false, mssg:'Not strong password'})

        if(!validator.isEmail(email)) 
            return  res.status(400).json({success:false, mssg:'Invalid email'})   
        
    } catch (error) {
        if(error instanceof Error)
            return res.status(400).json({success:false, mssg:'Error in signin middleware'})
        
    }

    next();

}

export default userSignUputh;