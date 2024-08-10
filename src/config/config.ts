import {config as con} from "dotenv"
con()

const _config = {
    port: process.env.PORT
}

export const config = Object.freeze(_config);