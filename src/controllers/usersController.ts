import { NextFunction, Request, Response } from "express"
import { matchedData, validationResult } from "express-validator";

export const userController = {
    registerUser:(req:Request,res:Response,next:NextFunction)=>{

        const result = validationResult(req)
        if(result.isEmpty()){
            const data = matchedData(req)
            return res.json({
                "message":`Welcome ${data.email}`
            })
        }

        res.send({ errors: result.array() });
    }    
}
