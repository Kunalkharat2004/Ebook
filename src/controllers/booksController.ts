import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Books from "../models/bookModel";
import { AuthRequest } from "../middlewares/authentication";
import uploadFileToCloudinary from "../utils/booksUtility/cloudinaryUploads";
import extractFileInfo from "../utils/booksUtility/extractFileInfo";
import storeBookInDB from "../utils/booksUtility/storeBookInDB";
import cloudinary from "../config/cloudinary";

const booksController = {

    createBook:async(req:Request,res:Response,next:NextFunction)=>{
      // console.log(req.files);
      const {genre,title,description} = req.body;
      
      try{

        const files = req.files as {[fieldname: string]:Express.Multer.File[]}

        const coverImageInfo = extractFileInfo(files,"coverImage","books-cover")
        const bookInfo = extractFileInfo(files,"file","books-pdfs");
        
        // Upload cover Image to cloudinary
       const coverImgUploadResult = await uploadFileToCloudinary(coverImageInfo.filePath,coverImageInfo.fileName,coverImageInfo.fileFormat,coverImageInfo.folder);

       // Upload book to cloudinary
       const bookUploadResult = await uploadFileToCloudinary(bookInfo.filePath,bookInfo.fileName,bookInfo.fileFormat,bookInfo.folder);
       
        // Store books information in database
        const newBook = await storeBookInDB(req,next,title,description,genre,coverImgUploadResult.secure_url,bookUploadResult.secure_url);

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

          const previousBookSplit = book.coverImage.split("/").slice(-2);
          const previousBookID = previousBookSplit.at(-2)+"/"+(previousBookSplit.at(-1)?.split(".").at(-2))
          
          // Extract coverImage info
          const coverImageInfo = extractFileInfo(files,"coverImage","books-cover")
          // Upload to cloud
          const coverImgUploadResult = await uploadFileToCloudinary(coverImageInfo.filePath,coverImageInfo.fileName,coverImageInfo.fileFormat,coverImageInfo.folder);

          // Delete the old file from cloudinary
          try{
              await cloudinary.uploader.destroy(previousBookID);
          }catch(err){
                console.error("Error occured while deleting the previous cover",err);
               return next(createHttpError(500,"Error occured while deleting the previous cover"))
          }

          coverImgUrl = coverImgUploadResult.secure_url
        }

        if (files.file) {

          const previousFileSplit = book.file.split("/").slice(-2);
          const previousFileID = previousFileSplit.at(-2)+"/"+(previousFileSplit.at(-1))
          
           // Delete the old file from cloudinary
           try{
            await cloudinary.uploader.destroy(previousFileID,{
              resource_type:"raw"
            });
        }catch(err){
              console.error("Error occured while deleting the previous pdf file",err);
             return next(createHttpError(500,"Error occured while deleting the previous pdf file"))
        }
          

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
      

    },

    singleBook:async(req:Request,res:Response,next:NextFunction)=>{
      try{
        const bookID:string = req.params.id;

        // Find the book by it's id in database 
        const book = await Books.findById(bookID).populate("author","name");;

        if(!book){
          return next(createHttpError(404,"Book doesn't exists!"))
        }
        res.json(book);

      }catch(err){
        console.error("Error occured while getting book",err);
        next(createHttpError(500,"Error occured while getting book"))
      }

    },

    listBook:async(req:Request,res:Response,next:NextFunction)=>{

      // const sleep = await new Promise((resolve)=>setTimeout(resolve,50000))
      try{
          const books = await Books.find().populate("author","name");
          res.json(books)

      }catch(err){
        console.error("Error occured while getting books",err);
        next(createHttpError(500,"Error occured while getting books"))
      }
    },

    deleteBook:async(req:Request,res:Response,next:NextFunction)=>{

      try{
        const bookID = req.params.id;
        const book = await Books.findById(bookID);

        if(!book){
          return next(createHttpError(404,"Book doesn't exists"));
        }
        const _req = req as AuthRequest
        if(_req.userID !== book.author.toString()){
          return next(createHttpError(403,"Not have permission to delete book"))
        }

        
        // Delete the coverImage from cloudinary
        try{
            const coverImageSplit = book.coverImage.split("/").slice(-2);
            const coverImageID = coverImageSplit.at(-2)+"/"+(coverImageSplit.at(-1)?.split(".").at(-2))
            await cloudinary.uploader.destroy(coverImageID);
        }catch(err){
              console.error("Error occured while deleting the coverImage",err);
             return next(createHttpError(500,"Error occured while deleting the coverImage"))
        }

        
        // Delete the file from cloudinary
        try{
           const FileSplit = book.file.split("/").slice(-2);
           const FileID = FileSplit.at(-2)+"/"+(FileSplit.at(-1))
          await cloudinary.uploader.destroy(FileID,{
            resource_type:"raw"
          });
      }catch(err){
            console.error("Error occured while deleting the pdf file",err);
           return next(createHttpError(500,"Error occured while deleting pdf file"))
      }

      // Delete books from database
      try{
          await Books.findByIdAndDelete(bookID)
      }catch(err){
        console.error("Error occured while deleting book from database",err);
        return next(createHttpError(500,"Error occured while deleting book from database"))
      }

        return res.sendStatus(204);
        
      }catch(err){
        console.error("Error occured while deleting book",err);
        next(createHttpError(500,"Error occured while deleting book"))
      }

        
    } 
}

export default booksController;