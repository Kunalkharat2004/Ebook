import { config } from "./src/config/config";
import app from "./src/app"

const main = ()=>{
    
    const PORT = config.port || 3300;

    app.listen(PORT,()=>{
        console.log(`Listening on port ${PORT}`);
    })
}

main()