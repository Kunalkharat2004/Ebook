import path from "path";

const extractFileInfo = (files: {[fieldname: string]: Express.Multer.File[]},fieldName:string,folder:string)=>{

    const fileName = files[fieldName][0].filename;
    const fileFormat = files[fieldName][0].mimetype.split("/").at(-1) as string;
    const filePath = path.resolve(__dirname,"../../../public/data/uploads",fileName);
    
    
    return {fileName,fileFormat,filePath,folder}
}

export default extractFileInfo;