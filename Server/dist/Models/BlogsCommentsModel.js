import mongoose from "mongoose";
const CommentsSchema = new mongoose.Schema({
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
}, {
    timestamps: true
});
const CommentsModel = mongoose.model("BlogPostsComments", CommentsSchema);
export default CommentsModel;
//# sourceMappingURL=BlogsCommentsModel.js.map