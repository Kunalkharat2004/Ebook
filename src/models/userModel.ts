import mongoose, {Schema} from "mongoose"
import { IUser } from "../utils/userTypes";


const userSchema = new Schema<IUser>({
    email:{
        type:String,
        required: true,
        unique:true,
        index: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password:{
        type:String,
        required:true,
        minlength:8
    }
},{
    timestamps:true
})
const User = mongoose.model<IUser>("User",userSchema)

export default User;