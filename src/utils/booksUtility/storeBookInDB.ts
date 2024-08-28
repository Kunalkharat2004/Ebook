import { Request, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { AuthRequest } from '../../middlewares/authentication';
import { IBook } from '../bookTypes';
import Books from '../../models/bookModel';

const storeBookInDB = async (
  req: Request,
  next: NextFunction,
  title: string,
  description:string,
  genre: string,
  coverImage: string,
  file: string
): Promise<IBook> => {
  try {
    const _req = req as AuthRequest;
    const newBook = new Books({
      title,
      description,
      genre,
      coverImage,
      file,
      author: _req.userID,
    });

    await newBook.save();
    return newBook;
  } catch (err) {
    console.error("Failed to store book in database", err);
    next(createHttpError(500, "Failed to store book in database"));
    throw err; // Re-throw the error to maintain the promise rejection
  }
};

export default storeBookInDB;
