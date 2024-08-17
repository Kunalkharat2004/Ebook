import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";

const booksController = {

    createBooks:async(req:Request,res:Response,next:NextFunction)=>{
      console.log(req.files);
      res.send("OK")
    }

}

export default booksController;