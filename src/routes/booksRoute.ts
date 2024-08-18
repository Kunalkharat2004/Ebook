import { Router } from "express";
import booksController from "../controllers/booksController";
import path from "path";
import multer from "multer";
import {authentication} from "../middlewares/authentication";

const router = Router()

const dest = path.resolve(__dirname,"../../public/data/uploads");
const upload = multer({
  dest:dest,
  limits:{fileSize: 10 * 1024 * 1024}
})

router.post("/",
    authentication,
  upload.fields([
    {name:"coverImage",maxCount:1},
    {name:"file",maxCount:1}
]),booksController.createBook)

router.put("/:id",
  authentication,
  upload.fields([
    {name:"coverImage",maxCount:1},
    {name:"file",maxCount:1}
  ]),
  booksController.updateBook
)

// Get Single book
router.get("/:id",booksController.singleBook)

// Get list of books
router.get("/",booksController.listBook);

// Delete a book
router.delete(
  "/:id",
  authentication,
  booksController.deleteBook
);

export default router;