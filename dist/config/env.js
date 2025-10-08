import dotenv from 'dotenv';
//load env variables from .env files
dotenv.config();
export const configEnv = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    MOVIE_PROVIDER: process.env.MOVIE_PROVIDER,
    OMDB_API_KEY: process.env.OMDB_API_KEY,
    OPEN_WEATHER_KEY: process.env.OPEN_WEATHER_API_KEY,
    WEATHER_PROVIDER: process.env.WEATHER_PROVIDER,
    FRONTEND_URL: process.env.FRONTEND_URL,
};
