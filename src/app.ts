import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import usersRoute from "./routes/usersRoute"
import booksRoute from "./routes/booksRoute"


const app = express();
app.use(express.json())

app.use("/api/users",usersRoute)
app.use("/api/books",booksRoute)

app.use(globalErrorHandler);

export default app;