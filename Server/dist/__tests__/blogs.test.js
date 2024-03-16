"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../utils/server");
const mongoose_1 = __importDefault(require("mongoose"));
const BlogsModel_1 = __importDefault(require("../Models/BlogsModel"));
const supertest_1 = __importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
jest.setTimeout(20000);
let token;
// BLOGS TESTING
(0, globals_1.describe)('Blogs Endpoints', () => {
    beforeAll(async () => {
        try {
            await mongoose_1.default.connect(process.env.MONGODB_URL);
        }
        catch (error) {
            console.error('Error while connecting:', error);
        }
    });
    let blog = null;
    (0, globals_1.beforeEach)(async () => {
        blog = await BlogsModel_1.default.findOne();
        const loginResponse = await (0, supertest_1.default)(server_1.app)
            .post("/auth/login")
            .send({ email: "twizald.02@gmail.com", password: "123123" });
        token = loginResponse.body.accessToken;
        console.log(token);
        console.log(loginResponse.body);
    });
    (0, globals_1.it)('POST /blog/ should create a blog', async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .post("/blog/")
            .set("Cookie", `access=${token}`)
            .send({
            author: "Fezag",
            title: "This should create a blog",
            content: "Testing successful blog creation",
            coverImage: "https://image2.png",
        });
        (0, globals_1.expect)(response.statusCode).toBe(200);
    });
    (0, globals_1.it)("should not create blog given missing the title", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .post("/blog/")
            .set("Cookie", `access=${token}`)
            .send({
            author: "Fezag",
            content: "Testing successful blog creation",
            coverImage: "https://image2.png",
        });
        (0, globals_1.expect)(response.status).toBe(500);
    });
    (0, globals_1.it)("should not create blog given missing the author", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .post("/blog/")
            .set("Cookie", `access=${token}`)
            .send({
            title: "This should create a blog",
            content: "Testing successful blog creation",
            coverImage: "https://image2.png",
        });
        (0, globals_1.expect)(response.status).toBe(500);
    });
    (0, globals_1.it)("should not create blog given missing the content", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .post("/blog/")
            .set("Cookie", `access=${token}`)
            .send({
            author: "Fezag",
            title: "This should create a blog",
            coverImage: "https://image2.png",
        });
        (0, globals_1.expect)(response.status).toBe(500);
    });
    (0, globals_1.it)("should not create blog given missing the coverImage", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .post("/blog/")
            .set("Cookie", `access=${token}`)
            .send({
            author: "Fezag",
            title: "This should create a blog",
            content: "Testing successful blog creation",
        });
        (0, globals_1.expect)(response.status).toBe(500);
    });
    (0, globals_1.it)('GET /blog/all', async () => {
        const response = await (0, supertest_1.default)(server_1.app).get("/blog/all");
        (0, globals_1.expect)(response.statusCode).toBe(200);
        (0, globals_1.expect)(response.body).toBeInstanceOf(Array);
        (0, globals_1.expect)(response.body[0]).toMatchObject({
            _id: globals_1.expect.any(String),
            title: globals_1.expect.any(String),
            content: globals_1.expect.any(String),
            coverImage: globals_1.expect.any(String),
            likes: globals_1.expect.any(Array),
            comments: globals_1.expect.any(Array),
            createdAt: globals_1.expect.any(String),
            updatedAt: globals_1.expect.any(String),
            __v: globals_1.expect.any(Number),
        });
    });
    test("GET /blog/:id should retrieve a specific blog post by ID", async () => {
        const response = await (0, supertest_1.default)(server_1.app).get(`/blog/${blog?._id}`);
        (0, globals_1.expect)(response.statusCode).toBe(200);
        (0, globals_1.expect)(response.body).toMatchObject({
            _id: globals_1.expect.any(String),
            title: globals_1.expect.any(String),
            content: globals_1.expect.any(String),
            coverImage: globals_1.expect.any(String),
            likes: globals_1.expect.any(Array),
            comments: globals_1.expect.any(Array),
            createdAt: globals_1.expect.any(String),
            updatedAt: globals_1.expect.any(String),
            __v: globals_1.expect.any(Number),
        });
    });
    (0, globals_1.it)("PATCH /blog/:id should update a specific blog post by ID", async () => {
        const updatedTitle = "Updated Test Blog testing test";
        const response = await (0, supertest_1.default)(server_1.app)
            .patch(`/blog/${blog?._id}`)
            .set("Cookie", `access=${token}`)
            .send({
            title: updatedTitle,
        });
        (0, globals_1.expect)(response.status).toBe(200);
    });
    (0, globals_1.it)("PATCH /blog/:nonexisting id shouldn't update a blog if the blog post ID does not exist", async () => {
        const updatedTitle = "Updated Test Blog";
        const response = await (0, supertest_1.default)(server_1.app)
            .patch('/blog/80984808049899')
            .set("Cookie", `access=${token}`)
            .send({
            title: updatedTitle,
        });
        (0, globals_1.expect)(response.status).toBe(500);
    });
    (0, globals_1.it)("should get blog by invalid blog id", async () => {
        const response = await (0, supertest_1.default)(server_1.app).get("/blog/invalid");
        (0, globals_1.expect)(response.status).toBe(500);
    });
    // liking functionality
    (0, globals_1.it)("should likes a blog if it exist", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .patch(`/blog/${blog?._id}/like`)
            .set("Cookie", `access=${token}`);
        (0, globals_1.expect)(response.status).toBe(200);
    });
    (0, globals_1.it)("should not allow liking an invalid or not found blog", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .patch(`/blog/65f31721b60056ba8c00e78c/like`)
            .set("Cookie", `access=${token}`);
        (0, globals_1.expect)(response.status).toBe(404);
        (0, globals_1.expect)(response.body.message).toBe("Blog Post Not Found");
    });
    (0, globals_1.it)("should not be allowed to like a blog if not authenticated", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .patch(`/blog/invalidBlog/like`)
            .set("Cookie", `access=${token}`);
        (0, globals_1.expect)(response.status).toBe(500);
    });
    // COMMENTING FUNCTIONALITY
    (0, globals_1.it)("should create a comment given the blog exist", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .post(`/blog/${blog?._id}/comment`)
            .set("Cookie", `access=${token}`)
            .send({
            message: "This blog should have the reaction message",
        });
        (0, globals_1.expect)(response.status).toBe(200);
    });
    (0, globals_1.it)("should not create a comment if the blog is invalid or not found", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .post(`/blog/65f31721b60056ba8c00e78c/comment`)
            .set("Cookie", `access=${token}`)
            .send({
            message: "This blog should have the reaction message",
        });
        (0, globals_1.expect)(response.status).toBe(404);
        (0, globals_1.expect)(response.body.message).toBe("Blog Post Not Found");
    });
    (0, globals_1.it)("should return 500 when given invalid blog id while attempting to create a comment", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .post(`/blog/invalidId/comment`)
            .set("Cookie", `access=${token}`)
            .send({
            message: "This blog should have the reaction message",
        });
        (0, globals_1.expect)(response.status).toBe(500);
    });
    // GETTING BLOG'S COMMENTS FUNCTIONALITY
    (0, globals_1.it)("should get all comments for a specific blog by passing in its id", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .get(`/blog/${blog?._id}/comments`)
            .set("Cookie", `access=${token}`);
        (0, globals_1.expect)(response.status).toBe(200);
    });
    (0, globals_1.it)("should return 404 if trying to comment on unexisting blog", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .get(`/blog/65f31721b60056ba8c00e78c/comments`)
            .set("Cookie", `access=${token}`);
        (0, globals_1.expect)(response.status).toBe(404);
        (0, globals_1.expect)(response.body.message).toBe("Blog Post Not Found");
    });
    (0, globals_1.it)("should return 500 when given invalid blog id while attempting to fetch or get or display its comments", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .get(`/blog/invalidId/comments`)
            .set("Cookie", `access=${token}`);
        (0, globals_1.expect)(response.status).toBe(500);
    });
    // DELETING COMMENT FUNCTIONALITY
    (0, globals_1.it)("delete blog by invalid blog id", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .delete("/blog/invalid")
            .set("Cookie", `access=${token}`);
        (0, globals_1.expect)(response.status).toBe(500);
    });
    (0, globals_1.it)("delete blog by not found blog id", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .delete("/blog/65ef6a3afc8ace8dbe144fc4")
            .set("Cookie", `access=${token}`);
        (0, globals_1.expect)(response.status).toBe(404);
        (0, globals_1.expect)(response.body.message).toBe("Blog Post Not Found");
    });
    (0, globals_1.it)("delete blog if found", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .delete(`/blog/${blog?._id}`)
            .set("Cookie", `access=${token}`);
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.body.message).toBe("Blog Post Successfully deleted");
    });
    (0, globals_1.afterAll)(async () => {
        try {
            await mongoose_1.default.connection.close();
        }
        catch (error) {
            console.error('Error while cleaning up:', error);
        }
    });
});
//# sourceMappingURL=blogs.test.js.map