import mongoose, { Document, Schema, Model } from "mongoose";

export interface Blog extends Document {
    author: string;
    title: string;
    content: string;
    coverImage: string;
    likes: any[];
    comments: any[];
}

const BlogsSchema: Schema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    likes: [],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
},
{
    timestamps: true
});

const BlogsModel: Model<Blog> = mongoose.model<Blog>("BlogPosts", BlogsSchema);
export default BlogsModel;