import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";

const booksController = {

    createBooks:async(req:Request,res:Response,next:NextFunction)=>{
      // console.log(req.files);

     try{

        const files = req.files as {[fieldname: string]:Express.Multer.File[]}

        const fileName = files.coverImage[0].filename;
        const bookFormat = files.coverImage[0].mimetype.split("/").at(-1)
        const filePath = path.resolve(__dirname,"../../public/data/uploads",fileName) 
        

        const uploadResult = await cloudinary.uploader.upload(filePath,{
          filename_override: fileName,
          folder:"books-cover",
          format: bookFormat
        })

        const bookName = files.file[0].filename
        const bookFilePath = path.resolve(__dirname,"../../public/data/uploads",bookName)

        const booksUploadResult = await cloudinary.uploader.upload(bookFilePath,{
          resource_type:"raw",
          filename_override:bookName,
          folder:"books-pdfs",
          format:"pdf"
        })
        console.log(booksUploadResult);
        
     }catch(err){
      console.error("Something went wrong",err);
      return next(createHttpError(500,"Failed to upload file"))
     }
      res.send("OK")
    }

}

export default booksController;