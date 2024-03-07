import mongoose, { Document, Schema, Model } from "mongoose";

export interface Comment extends Document {
    userId: string;
    name: string;
    email: string;
    message: string;
}

const CommentsSchema: Schema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    }
},
{
    timestamps: true
});

const CommentsModel: Model<Comment> = mongoose.model<Comment>("BlogPostsComments", CommentsSchema);
export default CommentsModel;