import { NextFunction, Request, Response } from "express";
import path from "path";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import Books from "../models/bookModel";
import fs from "fs"

const booksController = {

    createBooks:async(req:Request,res:Response,next:NextFunction)=>{
      // console.log(req.files);
      const {genre,title} = req.body;

      try{

        const files = req.files as {[fieldname: string]:Express.Multer.File[]}

        // Extract cover image info
        const coverImgName = files.coverImage[0].filename;
        const coverImgFormat = files.coverImage[0].mimetype.split("/").at(-1)
        const coverImgFilePath = path.resolve(__dirname,"../../public/data/uploads",coverImgName) 
        
        // Extract book file info
        const bookName = files.file[0].filename
        const bookFilePath = path.resolve(__dirname,"../../public/data/uploads",bookName)

        let coverImgUploadResult,bookUploadResult
        // Upload cover Image to cloudinary
        try{
            coverImgUploadResult = await cloudinary.uploader.upload(coverImgFilePath,{
              filename_override:coverImgName,
              format:coverImgFormat,
              folder:"books-cover"
            })
        }catch(err){
          console.error("Failed to uplaod cover image",err);
          return next(createHttpError(500,"Fail uploading cover image"))
        }

        // Upload books file to cloudinary
        try{
            bookUploadResult = await cloudinary.uploader.upload(bookFilePath,{
              resource_type:"raw",
              filename_override:bookName,
              format:"pdf",
              folder:"books-pdfs"
            })
        }catch(err){
              console.error("Failed to uplaod book file",err);
              return next(createHttpError(500,"Fail uploading book file"))
        }

        // Deleting files from local directory after successfully uploaded on cloudinary
        try{
            await fs.promises.unlink(coverImgFilePath);
            await fs.promises.unlink(bookFilePath);
        }catch(err){
          console.error("Failed to delete local files",err);
          return next(createHttpError(500,"Fail deleting local files"))
        }

        // Store books information in database
        try{
            const newBook = new Books({
              title,
              genre,
              coverImage: coverImgUploadResult.secure_url,
              file: bookUploadResult.secure_url,
              author:"66bf7f55f80a45c21d3415d6"
            })

            await newBook.save()

            res.status(201).json({
              "_id":newBook._id
            })
        }catch(err){
          console.error("Failed to store book in database",err);
          return next(createHttpError(500,"Failed to store book in database"))
        }
      
        
     }catch(err){
      console.error("Something went wrong",err);
      return next(createHttpError(500,"Failed to process book creation"))
     }
    }

}

export default booksController;