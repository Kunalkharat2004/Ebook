import express from "express"
import globalErrorHandler from "./middlewares/globalErrorHandler";
import createHttpError from "http-errors";

const app = express();

app.get("/",(req,res)=>{

    const error = createHttpError(400,"something went wrong!")
    throw error;
    
    res.json({
        "message":"Hello from home"
    })
})

app.use(globalErrorHandler)

export default app;