import mongoose, { Schema, Document } from "mongoose";

type chat = {
    message: String,
    sender: String,
    timestamp: Date;
}

const chatSchema : Schema<chat> = new mongoose.Schema<chat>({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Chat = mongoose.model<chat>("Chat", chatSchema);
export default Chat;