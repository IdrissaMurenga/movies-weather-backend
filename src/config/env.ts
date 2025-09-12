import dotenv from 'dotenv'

//load env variables from .env files
dotenv.config()

export const configEnv = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    MOVIE_PROVIDER: process.env.MOVIE_PROVIDER,
    OMDB_API_KEY: process.env.OMDB_API_KEY
}