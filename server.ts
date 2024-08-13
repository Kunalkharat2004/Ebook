import { config } from "./src/config/config";
import app from "./src/app"
import connectDB from "./src/config/db";

const main = async()=>{
    
    const PORT = config.port || 3300;

    await connectDB();

    app.listen(PORT,()=>{
        console.log(`Listening on port ${PORT}`);
    })
}

main()