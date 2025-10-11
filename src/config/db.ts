import mongoose from 'mongoose';
import { configEnv } from './env.js';
import type { Express } from 'express';

const connectDB = (app: Express) => {
  try {
    const PORT = Number(configEnv.PORT);
    //connect server to mongodb
    mongoose
      .connect(configEnv.MONGODB_URI as string)
      .then(() => {
        console.log('MongoDB connected');
        //starting and listening to the server
        app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}....`));
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
      });
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export default connectDB;
