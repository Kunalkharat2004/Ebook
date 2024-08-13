import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { IUser } from "../utils/userTypes";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

export const userController = {
    registerUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
                const {email,password} = req.body;

            // Check if the email is already registered
            const existingUser = await User.findOne({ email});
            if (existingUser) {
                const error = createHttpError(409,"Email is already in use")
                return next(error);
            }

            // Hashing the password
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                email,
                password: hashedPassword
            });

            await newUser.save();

            res.status(201).send({
                message: "Registration successful"
            });
        } catch (err) {
            console.error("Something went wrong!", err);
            // res.status(500).send({ message: "Server error, please try again later" });
            const error = createHttpError(500,"Server error, please try again later")
            return next(error);
        }
    },

    loginUser: async(req: Request, res: Response, next: NextFunction)=>{
        try{
            const {email,password} = req.body;

        const user = await User.findOne({email}) as IUser | null

        if(!user){
            const error = createHttpError(404,"Invalid credentials");
            return next(error);
        }

        const isMatch = await bcrypt.compare(password,user.password);
        
        if(!isMatch){
            const error = createHttpError(404,"Invalid credentials");
            return next(error);
        }

       const token = sign(
        {sub:user._id,email:user.email},
        config.jwtSecret as string,
        {expiresIn:"1h"}
    )
    res.send({ token, message: 'Login successful' });
        }catch(err){
            next(err);
        }

    }
};