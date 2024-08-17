import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Books from "../models/bookModel";
import { AuthRequest } from "../middlewares/authentication";
import uploadFileToCloudinary from "../utils/booksUtility/cloudinaryUploads";
import extractFileInfo from "../utils/booksUtility/extractFileInfo";
import storeBookInDB from "../utils/booksUtility/storeBookInDB";

const booksController = {

    createBook:async(req:Request,res:Response,next:NextFunction)=>{
      // console.log(req.files);
      const {genre,title} = req.body;
      
      try{

        const files = req.files as {[fieldname: string]:Express.Multer.File[]}

        const coverImageInfo = extractFileInfo(files,"coverImage","books-cover")
        const bookInfo = extractFileInfo(files,"file","books-pdfs");
        
        // Upload cover Image to cloudinary
       const coverImgUploadResult = await uploadFileToCloudinary(coverImageInfo.filePath,coverImageInfo.fileName,coverImageInfo.fileFormat,coverImageInfo.folder);

       // Upload book to cloudinary
       const bookUploadResult = await uploadFileToCloudinary(bookInfo.filePath,bookInfo.fileName,bookInfo.fileFormat,bookInfo.folder);
       
        // Store books information in database
        const newBook = await storeBookInDB(req,next,title,genre,coverImgUploadResult.secure_url,bookUploadResult.secure_url);

            res.status(201).json({
              "_id":newBook._id
            })
        
     }catch(err){
      console.error("Something went wrong",err);
      return next(createHttpError(500,"Failed to process book creation"))
     }
    },

    updateBook:async(req:Request,res:Response,next:NextFunction)=>{
      try{

        // If title or genre is undefined: MongoDB will ignore that field in the update operation, and the field will remain as it was in the document.
        const {title,genre} = req.body;
        
        const bookID = req.params.id;
  
        const book = await Books.findById(bookID);
        // Check whether the book with provided id exists or not
        if(!book){
          next(createHttpError(404,"Book doesn't exists"))
        }
  
        // Check that the user is the owner of the book
        const _req = req as AuthRequest;
        if(book?.author.toString() !== _req.userID as string){
          return next(createHttpError(403,"Not have permission to update"));
        }
  
        const files = req.files as {[fieldname: string]:Express.Multer.File[]}

        let coverImgUrl="",bookUrl=""
        if(files.coverImage){

          // Extract coverImage info
          const coverImageInfo = extractFileInfo(files,"coverImage","books-cover")
          // Upload to cloud
          const coverImgUploadResult = await uploadFileToCloudinary(coverImageInfo.filePath,coverImageInfo.fileName,coverImageInfo.fileFormat,coverImageInfo.folder);

          coverImgUrl = coverImgUploadResult.secure_url
        }

        if (files.file) {

          // Extract file info
          const bookInfo = extractFileInfo(files, "file", "books-pdfs");
          // Upload to cloud
          const bookUploadResult = await uploadFileToCloudinary(bookInfo.filePath, bookInfo.fileName,bookInfo.fileFormat, bookInfo.folder);

          bookUrl = bookUploadResult.secure_url;
        }

        // Update book information in database
        const updateBook = await Books.findOneAndUpdate({_id:bookID},
          {
            title,
            genre,
           coverImage: coverImgUrl? coverImgUrl:book.coverImage,
           file: bookUrl?bookUrl:book.file
          },
          {new:true}
        );

        res.json({
          book:updateBook
        })

      }catch(err){
        console.error("Failed to update book",err);
        return next(createHttpError(500,"Failed to update book"))
      }
      

    }

}

export default booksController;