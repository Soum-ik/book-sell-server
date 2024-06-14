import mongoose, { Schema, Document } from "mongoose";

export interface Book extends Document {
    images: [String],
    userId: string
}


const Book: Schema<Book> = new Schema({

})