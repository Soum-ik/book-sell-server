import mongoose, { Document, model, Schema } from "mongoose";


export interface User extends Document {
    username: String,
    email: String,
    password: String,
    verfiyCode?: String,
    verfiyCodeExpier?: String,

}


const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "User name require"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "please use valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    verfiyCode: {
        type: String,
        required: [true, "verfiyCode is required"]
    },
    verfiyCodeExpier: {
        type: String,
        required: [true, "verfiyCodeExpier is required"]
    }
}, {
    timestamps: true,
    versionKey: false
})

const User = mongoose.model("User", UserSchema)
export default User