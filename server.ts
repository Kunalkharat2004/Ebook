import app from "./src/app"

const main = ()=>{

    const PORT = process.env.PORT || 3300;

    app.listen(PORT,()=>{
        console.log(`Listening on port ${PORT}`);
    })
}

main()