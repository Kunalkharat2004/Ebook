import { NextFunction, Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import User from "../models/userModel";
import bcrypt from "bcrypt";

export const userController = {
    registerUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = validationResult(req);
            if (!result.isEmpty())
                return res.status(400).send({ errors: result.array() });

            // If user validation is true
            const data = matchedData(req);

            // Check if the email is already registered
            const existingUser = await User.findOne({ email: data.email });
            if (existingUser) {
                return res.status(409).send({ message: "Email is already in use" }); // 409 Conflict
            }

            // Hashing the password
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const newUser = new User({
                email: data.email,
                password: hashedPassword
            });

            await newUser.save();

            res.status(201).send({
                message: "Registration successful"
            });
        } catch (err) {
            console.error("Something went wrong!", err);
            res.status(500).send({ message: "Server error, please try again later" });
        }
    }
};
