import { Router } from "express";
import booksController from "../controllers/booksController";
import path from "path";
import multer from "multer";

const router = Router()

const dest = path.resolve(__dirname,"../../public/data/uploads");
const upload = multer({
  dest:dest,
  limits:{fileSize:3e7}
})

router.post("/",upload.fields([
    {name:"coverImage",maxCount:1},
    {name:"file",maxCount:1}
]),booksController.createBooks)

export default router;