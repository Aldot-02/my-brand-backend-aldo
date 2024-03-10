"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BlogsSchema = new mongoose_1.default.Schema({
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
    comments: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Comment' }]
}, {
    timestamps: true
});
const BlogsModel = mongoose_1.default.model("BlogPosts", BlogsSchema);
exports.default = BlogsModel;
//# sourceMappingURL=BlogsModel.js.map