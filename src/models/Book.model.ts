import mongoose, { Schema, Document } from "mongoose";


export interface Book extends Document {
    images: string[],
    userId: string,
    semester: string,
    totalBook: string,
    price: string,
    urgent: boolean,
    message: string,
    isAvaiableFullSet: boolean,
    isAccept: boolean
}

const BookSchema: Schema<Book> = new Schema<Book>({
    images: {
        type: [String],
        required: [true, "Images are required"],
        validate: {
            validator: function (v: String[]) {
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
        required: [true, "Price is required"],
        maxlength: 3
    },
    urgent: {
        type: Boolean,
        required: [true, "Urgency status is required"]
    },
    message: {
        type: String,
        required: [true, "Message is required"]
    },
    isAccept: {
        type: Boolean,
        default: false,
    },
    isAvaiableFullSet: {
        type: Boolean,
        required: [true, "isAvaiableFullSet is required"]
    }
}, {
    timestamps: true,
    versionKey: false
});

const Book = mongoose.model<Book>("Book", BookSchema);
export default Book;
