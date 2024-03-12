import BlogsModel, { Blog } from "../Models/BlogsModel";
import { Request, Response } from "express";
import CommentsModel, {Comment} from "../Models/BlogsCommentsModel"
import { CustomRequest } from '../Middlewares/middlewares'

// CREATING A BLOG
export const createBlog = async (req: Request, res: Response): Promise<void> => {
    const newBlog = new BlogsModel(req.body);

    try {
        await newBlog.save();
        res.status(200).json(newBlog);
    } catch (error) {
        res.status(500).json({message: error});
    }
};


//get a Blog
export const getBlog = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    try {
        const blog = await BlogsModel.findById(id);
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({message: error});
    }
};


// get All Blogs
export const getAllBlogs = async (req: Request, res: Response) : Promise<void> => {
    try {
        const blogs: Blog[] = await BlogsModel.find()
        res.status(200).send(blogs);
    } catch (error) {
        res.status(500).json({message: error});
    }
}

// Update a Blog
export const updateBlog = async (req: Request, res: Response): Promise<void> => {
    const blogPostId = req.params.id;

    try {
        const blogPost = await BlogsModel.findById(blogPostId);
        if(blogPost) {
            await blogPost.updateOne({ $set: req.body });
            res.status(200).json(blogPost);

        }
        else {
            res.status(404).json({message: "Blog Post Not found"});
        }
    } catch (error: any) {
        res.status(500).json({message: error});
    }
};

// Delete a Blog
export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    try {
        const blogPost = await BlogsModel.findById(id);
        if (blogPost) {
            await blogPost.deleteOne();
            res.status(200).json({message: "Blog Post Successfully deleted"});
        } else {
            res.status(404).json({message: "Blog Post Not Found"});
        }
    } catch (error: any) {
        res.status(500).json({message: error});
    }
};

// Liking a Blog Post
export const likeBlog = async (req: Request, res: Response): Promise<void> => {
    const blogId = req.params.id;
    const userId = req.body.userId;

    try {
        const blogPost = await BlogsModel.findById(blogId);
        if(blogPost){
            const index = blogPost.likes.indexOf(userId);
            if (index !== -1){
                blogPost.likes.splice(index, 1);
                await blogPost.save();
                res.status(200).json({message: "You unliked this Blog"});
            } else {
                blogPost.likes.push(userId);
                await blogPost.save();
                res.status(200).json({message: "You liked this Blog"});
            }
        } else {
            res.status(404).json({message: "Blog Post Not Found"});
        }
    } catch (error) {
        res.status(500).json({message: error});
    }
};

// Commenting on a blog post
export const commentBlog = async (req: CustomRequest, res: Response): Promise<void> => {
    const blogId = req.params.id;
    const { message } = req.body;

    const { _id, firstname, lastname, email } = req.user;
    const name = `${firstname} ${lastname}`;

    try {
        const blogPost = await BlogsModel.findById(blogId);
        if (blogPost) {
            const newComment = new CommentsModel({ userId: _id, name, email, message });
            await newComment.save();

            blogPost.comments.push(newComment._id);
            await blogPost.save();

            res.status(200).json(newComment);
        }
        else {
            res.status(404).json({message: "Blog Post Not Found"});
        }
    } catch (error) {
        res.status(500).json({message: error});
    }
};

// Getting a certain Blog's comments
export const getAllComments = async (req: Request, res: Response): Promise<void> => {
    const blogId = req.params.id;

    try {
        const blogPost = await BlogsModel.findById(blogId);

        if (blogPost) {
            const commentIds = blogPost.comments;

            if (commentIds.length === 0) {
                res.status(200).json({ message: "No comments for this blog" });
            } else {
                const comments = await CommentsModel.find({ _id: { $in: commentIds } });
                res.status(200).json(comments);
            }
        } else {
            res.status(404).json({ message: "Blog Post Not Found" });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};