"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_js_1 = require("../utils/server.js");
const UserModel_js_1 = __importDefault(require("../Models/UserModel.js"));
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = require("mongoose");
let connection, server;
beforeAll(async () => {
    connection = await (0, mongoose_1.createConnection)();
    await connection.dropDatabase();
    server = server_js_1.app.listen(process.env.PORT);
});
afterAll(() => {
    connection.close();
    server.close();
});
describe('POST /auth/register', () => {
    describe("Given all required credentials", () => {
        it('should create a new user when all required credentials are provided', async () => {
            const userData = {
                firstname: 'TTC',
                lastname: 'khazan',
                email: 'khazan@gmail.com',
                password: '123123',
                isAdmin: false
            };
            await (0, supertest_1.default)(server_js_1.app)
                .post('/auth/register')
                .send(userData)
                .expect(200)
                .expect('Content-Type', /json/)
                .then(async (response) => {
                expect(response.body).toMatchObject(userData);
                const savedUser = await UserModel_js_1.default.findOne({ email: userData.email });
                expect(savedUser).toBeTruthy();
            });
        });
    });
    describe('When one of the missing credentials is missing', () => {
        it('should return a 500 error if firstname is missing', async () => {
            const userData = {
                lastname: '',
                email: '',
                password: ''
            };
            await (0, supertest_1.default)(server_js_1.app)
                .post('/auth/register')
                .send(userData)
                .expect(400);
        });
        it('should return a 500 error if lastname is missing', async () => {
            const userData = {
                firstname: '',
                email: '',
                password: ''
            };
            await (0, supertest_1.default)(server_js_1.app)
                .post('/auth/register')
                .send(userData)
                .expect(400);
        });
        it('should return a 500 error if email is missing', async () => {
            const userData = {
                firstname: '',
                lastname: '',
                password: ''
            };
            await (0, supertest_1.default)(server_js_1.app)
                .post('/auth/register')
                .send(userData)
                .expect(400);
        });
        it('should return a 500 error if firstname is missing', async () => {
            const userData = {
                firstname: '',
                lastname: '',
                email: ''
            };
            await (0, supertest_1.default)(server_js_1.app)
                .post('/auth/register')
                .send(userData)
                .expect(400);
        });
    });
});
//# sourceMappingURL=auth.test.js.map