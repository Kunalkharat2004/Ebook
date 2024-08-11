import {config as con} from "dotenv"
con()

const _config = {
    port: process.env.PORT,
    databaseUrl: process.env.MONGO_CONNECTION_URL,
    env:process.env.NODE_ENV
}

export const config = Object.freeze(_config);