import mongoose from "mongoose";
import { config } from "./config";
const connectDB = async()=>{
    try{
        mongoose.connection.on("connected",()=>{
            console.log("Successfully connected to database!");
        })
    
        mongoose.connection.on("error",()=>{
            console.error("Connection to database falied!");
        })
    
        await mongoose.connect(config.databaseUrl as string)
    
    }
    catch(err){
        console.error("Failed connecting to database!",err);
        process.exit(1);
    }
}

export default connectDB;