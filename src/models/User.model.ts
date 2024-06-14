import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verfiyCode?: string,
    verfiyCodeExpier?: Date,
    number: string,
    image: string,
    role: string,
    suspend: boolean,
    isVerificationCodeExpired: () => boolean
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "User name required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please use a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    verfiyCode: {
        type: String,
        required: [true, "Verification code is required"]
    },
    verfiyCodeExpier: {
        type: Date,
        required: [true, "Verification code expiration date is required"]
    },
    number: {
        type: String,
        required: [true, "Number is required"],
        unique: true,
        match: [/^(?:\+88|88)?(01[3-9]\d{8})$/, "Please use a valid mobile number"]
    },
    image: {
        type: String,
        required: [true, "Image is required"]
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        required: [true, "Role is required"],
        default: "USER"
    },
    suspend: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

UserSchema.methods.isVerificationCodeExpired = function (): boolean {
    return this.verfiyCodeExpier && this.verfiyCodeExpier < new Date();
};

const Users = mongoose.model<User>("Users", UserSchema);
export default Users;
