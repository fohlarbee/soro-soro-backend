import * as dotenv from 'dotenv'
import {str, cleanEnv} from 'envalid'

dotenv.config()


const env = cleanEnv(process.env, {
    PORT:str(),
    SECRET_TOKEN_KEY: str(),
    SECRET_TOKEN_EXPIRY: str(),
    REFRESH_SECRET_KEY: str(),
    REFRESH_SECRET_EXPIRY: str(),
    GOOGLE_OAUTH_CLIENT_ID: str(),
    GOOGLE_OAUTH_CLIENT_SECRET: str(),
    GOOGLE_OAUTH_REDIRECT_URL: str(),
    MONGO_URL:str(),
    NODE_ENV:str(),

});

export default env;