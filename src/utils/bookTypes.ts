import { IUser } from "./userTypes";


interface IBooks{
    _id:string,
    title: string,
    genre:string,
    coverImage:string,
    author:IUser,
    file:string,
    createdAt:Date,
    updatedAt:Date
}

export default IBooks;