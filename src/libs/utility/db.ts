// import mongoose, { type ConnectOptions } from "mongoose";
import { MONGODB_CONNECTION } from "../../config/config.ts";

// // MongoDB connection options
// const mongooseOptions: ConnectOptions = {
//     autoIndex: true,
// };

// // Define a type for the connection function
// type DbConnection = () => Promise<void>;

// // MongoDB connection function
// export const dbConnection: DbConnection = async () => {
//     try {
//         if (mongoose.connection.readyState === 1) {
//             console.log("Database already connected");
//             return;
//         }
//         await mongoose.connect(MONGODB_CONNECTION, mongooseOptions);
//         console.log("Database Connected");
//     } catch (err) {
//         console.error("Database connection error:", err);
//         throw err; // Optionally re-throw the error for higher level handling
//     }
// };

import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};
export async function dbConnection(): Promise<void> {
    if (connection.isConnected) {
        console.log(" 🛢 Already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(MONGODB_CONNECTION || "");

        connection.isConnected = db.connections[0].readyState;
        console.log(`🛢   Database has been connected successfully`);
    } catch (error) {
        console.log("Database connection failed", error);

        process.exit(1);
    }
}

 