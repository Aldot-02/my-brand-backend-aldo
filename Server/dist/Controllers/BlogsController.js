"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllComments = exports.commentBlog = exports.likeBlog = exports.deleteBlog = exports.updateBlog = exports.getAllBlogs = exports.getBlog = exports.createBlog = void 0;
const BlogsModel_1 = __importDefault(require("../Models/BlogsModel"));
const BlogsCommentsModel_1 = __importDefault(require("../Models/BlogsCommentsModel"));
// CREATING A BLOG
const createBlog = async (req, res) => {
    const newBlog = new BlogsModel_1.default(req.body);
    try {
        await newBlog.save();
        res.status(200).json(newBlog);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};
exports.createBlog = createBlog;
//get a Blog
const getBlog = async (req, res) => {
    const id = req.params.id;
    try {
        const blog = await BlogsModel_1.default.findById(id);
        res.status(200).json(blog);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};
exports.getBlog = getBlog;
// get All Blogs
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await BlogsModel_1.default.find();
        res.status(200).send(blogs);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};
exports.getAllBlogs = getAllBlogs;
// Update a Blog
const updateBlog = async (req, res) => {
    const blogPostId = req.params.id;
    try {
        const blogPost = await BlogsModel_1.default.findById(blogPostId);
        if (blogPost) {
            await blogPost.updateOne({ $set: req.body });
            res.status(200).json(blogPost);
        }
        else {
            res.status(404).json({ message: "Blog Post Not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};
exports.updateBlog = updateBlog;
// Delete a Blog
const deleteBlog = async (req, res) => {
    const id = req.params.id;
    try {
        const blogPost = await BlogsModel_1.default.findById(id);
        if (blogPost) {
            await blogPost.deleteOne();
            res.status(200).json({ message: "Blog Post Successfully deleted" });
        }
        else {
            res.status(404).json({ message: "Blog Post Not Found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};
exports.deleteBlog = deleteBlog;
// Liking a Blog Post
const likeBlog = async (req, res) => {
    const blogId = req.params.id;
    const userId = req.body.userId;
    try {
        const blogPost = await BlogsModel_1.default.findById(blogId);
        if (blogPost) {
            const index = blogPost.likes.indexOf(userId);
            if (index !== -1) {
                blogPost.likes.splice(index, 1);
                await blogPost.save();
                res.status(200).json({ message: "You unliked this Blog" });
            }
            else {
                blogPost.likes.push(userId);
                await blogPost.save();
                res.status(200).json({ message: "You liked this Blog" });
            }
        }
        else {
            res.status(404).json({ message: "Blog Post Not Found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};
exports.likeBlog = likeBlog;
// Commenting on a blog post
const commentBlog = async (req, res) => {
    const blogId = req.params.id;
    const { message } = req.body;
    const { _id, firstname, lastname, email } = req.user;
    const name = `${firstname} ${lastname}`;
    try {
        const blogPost = await BlogsModel_1.default.findById(blogId);
        if (blogPost) {
            const newComment = new BlogsCommentsModel_1.default({ userId: _id, name, email, message });
            await newComment.save();
            blogPost.comments.push(newComment._id);
            await blogPost.save();
            res.status(200).json(newComment);
        }
        else {
            res.status(404).json({ message: "Blog Post Not Found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};
exports.commentBlog = commentBlog;
// Getting a certain Blog's comments
const getAllComments = async (req, res) => {
    const blogId = req.params.id;
    try {
        const blogPost = await BlogsModel_1.default.findById(blogId);
        if (blogPost) {
            const commentIds = blogPost.comments;
            if (commentIds.length === 0) {
                res.status(200).json({ message: "No comments for this blog" });
            }
            else {
                const comments = await BlogsCommentsModel_1.default.find({ _id: { $in: commentIds } });
                res.status(200).json(comments);
            }
        }
        else {
            res.status(404).json({ message: "Blog Post Not Found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllComments = getAllComments;
//# sourceMappingURL=BlogsController.js.map