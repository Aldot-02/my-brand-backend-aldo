"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../utils/server");
const mongoose_1 = __importDefault(require("mongoose"));
const UserModel_1 = __importDefault(require("../Models/UserModel"));
const supertest_1 = __importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
jest.setTimeout(20000);
// USERS TESTING
let token;
// BLOGS TESTING
(0, globals_1.describe)('Users Endpoints', () => {
    beforeAll(async () => {
        try {
            await mongoose_1.default.connect(process.env.MONGODB_URL);
        }
        catch (error) {
            console.error('Error while connecting:', error);
        }
    });
    let user = null;
    (0, globals_1.beforeEach)(async () => {
        user = await UserModel_1.default.findOne();
        const loginResponse = await (0, supertest_1.default)(server_1.app)
            .post("/auth/login")
            .send({ email: "twizald.02@gmail.com", password: "123123" });
        token = loginResponse.body.accessToken;
        console.log(token);
        console.log(loginResponse.body);
    });
    (0, globals_1.it)('GET /user/ should get all users given the admin permission', async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .get("/user/")
            .set("Cookie", `access=${token}`);
        (0, globals_1.expect)(response.statusCode).toBe(200);
        (0, globals_1.expect)(response.body).toBeInstanceOf(Array);
        (0, globals_1.expect)(response.body[0]).toMatchObject({
            _id: globals_1.expect.any(String),
            firstname: globals_1.expect.any(String),
            lastname: globals_1.expect.any(String),
            email: globals_1.expect.any(String),
            isAdmin: globals_1.expect.any(Boolean),
            createdAt: globals_1.expect.any(String),
            updatedAt: globals_1.expect.any(String),
            __v: globals_1.expect.any(Number),
        });
    });
    (0, globals_1.it)("should get a user by user role or admin role given user id", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .get(`/user/${user?._id}`)
            .set("Cookie", `access=${token}`);
        (0, globals_1.expect)(response.statusCode).toBe(200);
    });
    (0, globals_1.it)("get user by not found id", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .get(`/user/65f39f9fb3fdfd182ba2a885`)
            .set("Cookie", `access=${token}`);
        (0, globals_1.expect)(response.statusCode).toBe(404);
        (0, globals_1.expect)(response.body.message).toBe("User Doesn't exist");
    });
    (0, globals_1.it)("should not get a user without authentication", async () => {
        const response = await (0, supertest_1.default)(server_1.app).get(`/user/${user?._id}`);
        (0, globals_1.expect)(response.statusCode).toBe(401);
    });
    (0, globals_1.it)("should not get a user given no permission to do so", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .get(`/user/invalidUserId`)
            .set("Cookie", `access=${token}`);
        (0, globals_1.expect)(response.statusCode).toBe(500);
    });
    (0, globals_1.it)("should get an authenticated user profile", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .get("/user/profile")
            .set("Cookie", `access=${token}`);
        (0, globals_1.expect)(response.statusCode).toBe(200);
    });
    (0, globals_1.it)("should not get an unauthenticated user profile", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .get("/user/profile");
        (0, globals_1.expect)(response.statusCode).toBe(401);
    });
    // UPDATING A USER
    (0, globals_1.it)("PATCH /user/:id should update a specific blog post by ID", async () => {
        const updatedFirstName = "Telephone Name";
        const response = await (0, supertest_1.default)(server_1.app)
            .patch(`/user/${user?._id}`)
            .set("Cookie", `access=${token}`)
            .send({
            firstname: updatedFirstName,
        });
        (0, globals_1.expect)(response.status).toBe(200);
    });
    // Should not update an unexisting user
    (0, globals_1.it)("PATCH /user/:nonexisting id shouldn't update a user if the user ID does not exist", async () => {
        const updatedFirstName = "Unexisting blog";
        const response = await (0, supertest_1.default)(server_1.app)
            .patch('/user/80984808049899')
            .set("Cookie", `access=${token}`)
            .send({
            firstname: updatedFirstName,
        });
        (0, globals_1.expect)(response.status).toBe(500);
    });
    (0, globals_1.it)("delete user by invalid user id", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .delete("/user/invalid")
            .set("Cookie", `access=${token}`);
        (0, globals_1.expect)(response.status).toBe(500);
    });
    (0, globals_1.it)("delete user if found with proper permissions", async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .delete(`/user/${user?._id}`)
            .set("Cookie", `access=${token}`);
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.body.message).toBe("Account deleted successfully");
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
//# sourceMappingURL=user.test.js.map