import mongoose from "mongoose";
import { configEnv } from "./env.js";
import type { Express } from "express";

const connectDB = (app: Express) => {
    try {
        //connect server to mongodb
        mongoose.connect(configEnv.MONGODB_URI as string)
            .then(() => {
                console.log("MongoDB connected");

                //starting and listening to the server
                app.listen(configEnv.PORT, () =>
                    console.log(`Server running on port ${configEnv.PORT}....`)
                );
            })
            .catch((error) => {
                console.error("MongoDB connection error:", error);
            });
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

export default connectDB;
