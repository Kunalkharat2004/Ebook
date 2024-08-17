import mongoose, { Schema } from "mongoose";
import IBooks from "../utils/bookTypes";

const bookSchema = new Schema({
    _id:{
        type:String,
        unique:true,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    genre:{
        type:String,
        required:true
    },
    coverImage:{
        type: String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    file:{
        type: String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true
    },
    updatedAt:{
        type:Date
    }

},
{timestamps:true}
);

const Books = mongoose.model("Book",bookSchema);

export default Books;