import BlogsModel from "../Models/BlogsModel.js";
import CommentsModel from "../Models/BlogsCommentsModel.js";
// CREATING A BLOG
export const createBlog = async (req, res) => {
    const newBlog = new BlogsModel(req.body);
    try {
        await newBlog.save();
        res.status(200).json(newBlog);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};
//get a Blog
export const getBlog = async (req, res) => {
    const id = req.params.id;
    try {
        const blog = await BlogsModel.findById(id);
        res.status(200).json(blog);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};
// get All Blogs
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await BlogsModel.find();
        res.status(200).send(blogs);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};
// Update a Blog
export const updateBlog = async (req, res) => {
    const blogPostId = req.params.id;
    try {
        const blogPost = await BlogsModel.findById(blogPostId);
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
// Delete a Blog
export const deleteBlog = async (req, res) => {
    const id = req.params.id;
    try {
        const blogPost = await BlogsModel.findById(id);
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
// Liking a Blog Post
export const likeBlog = async (req, res) => {
    const blogId = req.params.id;
    const userId = req.body.userId;
    try {
        const blogPost = await BlogsModel.findById(blogId);
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
// Commenting on a blog post
export const commentBlog = async (req, res) => {
    const blogId = req.params.id;
    const { userId, name, email, message } = req.body;
    try {
        const blogPost = await BlogsModel.findById(blogId);
        if (blogPost) {
            const newComment = new CommentsModel({ userId, name, email, message });
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
// Getting a certain Blog's comments
export const getAllComments = async (req, res) => {
    const blogId = req.params.id;
    try {
        const blogPost = await BlogsModel.findById(blogId);
        if (blogPost) {
            const commentIds = blogPost.comments;
            if (commentIds.length === 0) {
                res.status(200).json({ message: "No comments for this blog" });
            }
            else {
                const comments = await CommentsModel.find({ _id: { $in: commentIds } });
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
//# sourceMappingURL=BlogsController.js.map