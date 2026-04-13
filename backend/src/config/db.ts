import mongoose from "mongoose";
import { config } from "./config";

export const connectDb = async () => {
    try {
        await mongoose.connect(config.mongoUri)
        console.log("Connected to MongoDB");
    }
    catch (error: any) {
        console.error("Error connecting to MongoDB:", error.message);
    }
}