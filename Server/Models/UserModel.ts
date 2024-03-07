import mongoose, { Document, Model } from "mongoose";

export interface User extends Document {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

const userSchema = new mongoose.Schema<User>({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

const UserModel: Model<User> = mongoose.model<User>("Users", userSchema);
export default UserModel;