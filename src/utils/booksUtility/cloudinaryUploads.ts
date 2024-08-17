import cloudinary from "../../config/cloudinary"
import createHttpError from "http-errors";
import fs from "node:fs"

const uploadFileToCloudinary = async(filePath:string,fileName:string,format:string,folder:string)=>{
    try{
        const uploadResult = await cloudinary.uploader.upload(filePath,{
            resource_type: format === "pdf"? "raw":"image",
            filename_override: fileName,
            format,
            folder
        })

         // Deleting files from local directory after successfully uploaded on cloudinary
         try{
            await fs.promises.unlink(filePath);
        }catch(err){
            console.error("Failed to delete local files",err);
            throw createHttpError(500,"Fail deleting local files")
        }
        return uploadResult;

    }catch(err){
        console.error(`Failed to upload ${format} file`,err);
        throw createHttpError(500, `Failed uploading ${format} file`);
    }
}

export default uploadFileToCloudinary;