import mongoose, { Schema, Document } from "mongoose";

export interface Like extends Document {
    userId: string;
    postId: mongoose.Schema.Types.ObjectId; // Reference to the Post model
    usersLiked: string[]; // Array of user IDs who have liked the post
    userImage?: string;
}

const likeSchema: Schema<Like> = new Schema<Like>({
    userId: {
        type: String,
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Reference to the Post model
        required: true
    },
    usersLiked: {
        type: [String],
        required: true,
        default: []
    },
    userImage: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
    versionKey: false
});

export const Like = mongoose.model<Like>('Like', likeSchema);
