import { Document, Types } from "mongoose";

export interface IBook extends Document {
  title: string;
  genre: string;
  coverImage: string;
  author: Types.ObjectId; // or 'mongoose.Schema.Types.ObjectId'
  file: string;
}
