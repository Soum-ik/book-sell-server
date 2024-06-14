import mongoose from "mongoose";
import { MONGODB_CONNECTION } from "../../config/config.ts"

// MongoDB connection
export const dbConnection = mongoose.connect(MONGODB_CONNECTION, { autoIndex: true })
    .then(() => {
        console.log("Database Connected");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });
