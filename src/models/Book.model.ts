import mongoose, { Schema, Document } from "mongoose";

export interface Book extends Document {
    images: string[],
    userId: string,
    semester: string,
    totalBook: string,
    price: string,
    urgent: string,
    message: string,
}

const BookSchema: Schema<Book> = new Schema({
    images: {
        type: [String],
        required: [true, "Images are required"],
        validate: {
            validator: function (v: string[]) {
                return v.length >= 3 && v.length <= 5;
            },
            message: "You must upload between 3 and 5 images."
        }
    },
    userId: {
        type: String,
        required: [true, "User ID is required"]
    },
    semester: {
        type: String,
        required: [true, "Semester is required"]
    },
    totalBook: {
        type: String,
        required: [true, "Total book count is required"]
    },
    price: {
        type: String,
        required: [true, "Price is required"]
    },
    urgent: {
        type: String,
        required: [true, "Urgency status is required"]
    },
    message: {
        type: String,
        required: [true, "Message is required"]
    }
}, {
    timestamps: true,
    versionKey: false
});

const Book = mongoose.model<Book>("Book", BookSchema);
export default Book;
