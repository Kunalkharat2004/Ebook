import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import usersRoute from "./routes/usersRoute"

const app = express();
app.use(express.json())

app.use("/api/users",usersRoute)

app.use(globalErrorHandler);

export default app;