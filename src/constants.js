import * as env from 'dotenv'
env.config()

export const {
    URI,
    NODE_ENV,
    PRIVATE_KEY
} = process.env 