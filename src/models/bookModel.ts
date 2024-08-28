import mongoose, { Schema, model } from "mongoose";
import { IBook } from "../utils/bookTypes"; // Adjust the path as needed

const bookSchema = new Schema<IBook>({
  title: {
    type: String,
    required: true,
  },
  description:{
    type:String,
    required:true
  },
  genre: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  file: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Books = model<IBook>("Book", bookSchema);

export default Books;
