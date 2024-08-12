import {Router} from "express"
import {userController} from "../controllers/usersController"
import {validateUserCredentials} from "../utils/validationSchema"

const router = Router()

router.post("/register",validateUserCredentials,userController.registerUser)

export default router