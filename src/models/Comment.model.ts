import mongoose, { Schema, Document } from "mongoose";

export interface Comment extends Document {
    userId: string;
    postId: mongoose.Schema.Types.ObjectId;
    comments: string;
    userImage?: string;
    username?: string
}

const commentSchema: Schema<Comment> = new Schema<Comment>({
    userId: {
        type: String,
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Reference to the Post model
        required: true
    },
    comments: {
        type: String
    },
    userImage: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
    versionKey: false
});

export const Comment = mongoose.model<Comment>('Comment', commentSchema);
