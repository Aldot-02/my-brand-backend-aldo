import mongoose from "mongoose";
const BlogsSchema = new mongoose.Schema({
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
}, {
    timestamps: true
});
const BlogsModel = mongoose.model("BlogPosts", BlogsSchema);
export default BlogsModel;
//# sourceMappingURL=BlogsModel.js.map