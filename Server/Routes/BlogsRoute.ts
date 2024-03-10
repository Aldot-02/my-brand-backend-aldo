import express, { Router } from 'express';
import { commentBlog, createBlog, deleteBlog, getAllBlogs, getAllComments, getBlog, likeBlog, updateBlog } from '../Controllers/BlogsController';
import { isAuthenticated, isAdmin } from '../Middlewares/middlewares';

const router: Router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Blogs
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - userId
 *         - name
 *         - email
 *         - message
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user who posted the comment.
 *         name:
 *           type: string
 *           description: The name of the user who posted the comment.
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the user who posted the comment.
 *         message:
 *           type: string
 *           description: The content of the comment.
 *       example:
 *         userId: 60e97c9fcf5c026b848860d3
 *         name: Aldo Twizerimana
 *         email: twizald.02@gmail.com
 *         message: This blog is very interesting
 *
 *     Blog:
 *       type: object
 *       required:
 *         - author
 *         - title
 *         - content
 *         - coverImage
 *       properties:
 *         author:
 *           type: string
 *           description: The author of the blog post.
 *         title:
 *           type: string
 *           description: The title of the blog post.
 *         content:
 *           type: string
 *           description: The content of the blog post.
 *         coverImage:
 *           type: string
 *           description: The URL of the cover image for the blog post.
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of user IDs who liked the blog post.
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: An array of comment IDs associated with the blog post.
 *       example:
 *         author: Aldo Twizerimana
 *         title: Development Strategies
 *         content: This is a Blog about Developement strategies
 *         coverImage: "https://image1.png"
 *         likes: ["60e97c9fcf5c026b848860d3"]
 *         comments: ["60e97c9fcf5c026b848860d3"]
 */

/**
 * @openapi
 * /blog/:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       '200':
 *         description: Created blog post object
 *       '500':
 *         description: Internal server error
 */
router.post('/', isAuthenticated, isAdmin, createBlog);

/**
 * @openapi
 * /blog/all:
 *   get:
 *     summary: Retrieve all blog posts
 *     tags: [Blogs]
 *     responses:
 *       '200':
 *         description: An array of blog post objects
 *       '500':
 *         description: Internal server error
 */
router.get('/all', getAllBlogs);

/**
 * @openapi
 * /blog/{id}:
 *   get:
 *     summary: Retrieve a blog post by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A blog post object
 *       '404':
 *         description: Blog post not found
 *       '500':
 *         description: Internal server error
 */
router.get('/:id', getBlog);

/**
 * @openapi
 * /blog/{id}:
 *   patch:
 *     summary: Update a blog post by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       '200':
 *         description: Updated blog post object
 *       '404':
 *         description: Blog post not found
 *       '500':
 *         description: Internal server error
 */
router.patch('/:id', isAuthenticated, isAdmin, updateBlog);

/**
 * @openapi
 * /blog/{id}:
 *   delete:
 *     summary: Delete a blog post by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Blog post deleted successfully
 *       '404':
 *         description: Blog post not found
 *       '500':
 *         description: Internal server error
 */
router.delete('/:id', isAuthenticated, isAdmin, deleteBlog);

/**
 * @openapi
 * /blog/{id}/like:
 *   patch:
 *     summary: Like or unlike a blog post
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *             required:
 *               - userId
 *     responses:
 *       '200':
 *         description: Liked or unliked the blog post
 *       '404':
 *         description: Blog post not found
 *       '500':
 *         description: Internal server error
 */
router.patch('/:id/like', isAuthenticated, likeBlog);

/**
 * @openapi
 * /blog/{id}/comment:
 *   post:
 *     summary: Add a comment to a blog post
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The comment message
 *             required:
 *               - message
 *     responses:
 *       '200':
 *         description: Created comment object
 *       '404':
 *         description: Blog post not found
 *       '500':
 *         description: Internal server error
 */
router.post('/:id/comment', isAuthenticated, commentBlog);

/**
 * @openapi
 * /blog/{id}/comments:
 *   get:
 *     summary: Retrieve all comments for a blog post
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: An array of comment objects
 *       '404':
 *         description: Blog post not found
 *       '500':
 *         description: Internal server error
 */
router.get('/:id/comments', getAllComments);

export default router;