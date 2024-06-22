import mongoose, { Schema, Document } from "mongoose";



export type Semesters = '1st' | '2nd' | '3rd' | '4th' | '5th' | '6th' | '7th'

export interface Post extends Document {
    images: string[],
    userId: string,
    semester: Semesters,
    totalBook: number,
    price: number,
    urgent: boolean,
    message: string,
    isAvaiableFullSet: boolean,
    isAccept: boolean,
    sold: boolean,
    comment?: string[],
    like?: number,
    bookmark?: number,
}

const PostSchema: Schema<Post> = new Schema<Post>({
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
        type: Number,
        required: [true, "Total book count is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [1, "Price should be at least 1"],
        max: [999, "Price should be less than 1000"]
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
    },
    sold: {
        type: Boolean,
        default: false,
    },
    comment: {
        type: [String],
    },
    like: {
        type: Number,
    },
    bookmark: {
        type: Number
    },
}, {
    timestamps: true,
    versionKey: false
});

const Post = mongoose.model<Post>("Post", PostSchema);
export default Post;
