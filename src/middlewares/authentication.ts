import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
    userID: string;
}

export const authentication = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as string;

    if (!token) {
        return next(createHttpError(401, "Authorization token is required"));
    }

    const parsedToken = token.split(" ").at(-1);
    let decoded;
    try {
        decoded = jwt.verify(parsedToken as string, config.jwtSecret as string);
        const _req = req as AuthRequest
        _req.userID = decoded.sub as string
        next();
        
    } catch (err) {
        console.error("JWT token verification failed",err);
        return next(createHttpError(401, "Invalid token"));
    }

  
};
