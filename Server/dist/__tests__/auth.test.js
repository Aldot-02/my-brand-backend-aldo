"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../utils/server");
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const globals_1 = require("@jest/globals");
jest.setTimeout(20000);
beforeAll(async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URL);
    }
    catch (error) {
        console.error('Error while connecting:', error);
    }
});
// REGISTERING A USER TEST
(0, globals_1.describe)('POST /auth/register', () => {
    (0, globals_1.describe)('Given all required credentials', () => {
        (0, globals_1.it)('should return error when the account already exist.', async () => {
            const userData = {
                firstname: 'TTC',
                lastname: 'khazan1',
                email: 'khazan@gmail.com',
                password: '123123',
                isAdmin: false
            };
            const response = await (0, supertest_1.default)(server_1.app)
                .post('/auth/register')
                .send(userData);
            (0, globals_1.expect)(response.status).toBe(409);
            (0, globals_1.expect)(response.body.message).toBe("Account already exists with this email.");
        });
        (0, globals_1.it)('should create a new user when all required credentials are provided', async () => {
            const userData = {
                firstname: 'Aldo',
                lastname: 'Twizerimana',
                email: 'twizald.02@gmail.com',
                password: '123123',
                isAdmin: true
            };
            await (0, supertest_1.default)(server_1.app)
                .post('/auth/register')
                .send(userData)
                .expect(200)
                .expect('Content-Type', /json/)
                .then(async (response) => {
                (0, globals_1.expect)(response.body).toHaveProperty('_id');
            });
        });
    });
    (0, globals_1.describe)('When one or more required credentials are missing', () => {
        (0, globals_1.it)('should return a 400 error if firstname is missing', async () => {
            const userData = {
                lastname: 'khazan',
                email: 'khazan@gmail.com',
                password: '123123'
            };
            await (0, supertest_1.default)(server_1.app)
                .post('/auth/register')
                .send(userData)
                .expect(400);
        });
        (0, globals_1.it)('should return a 400 error if lastname is missing', async () => {
            const userData = {
                firstname: 'TTC',
                email: 'khazan@gmail.com',
                password: '123123'
            };
            await (0, supertest_1.default)(server_1.app)
                .post('/auth/register')
                .send(userData)
                .expect(400);
        });
        (0, globals_1.it)('should return a 400 error if email is missing', async () => {
            const userData = {
                firstname: 'TTC',
                lastname: 'khazan',
                password: '123123'
            };
            await (0, supertest_1.default)(server_1.app)
                .post('/auth/register')
                .send(userData)
                .expect(400);
        });
        (0, globals_1.it)('should return a 400 error if password is missing', async () => {
            const userData = {
                firstname: 'TTC',
                lastname: 'khazan',
                email: 'khazan@gmail.com'
            };
            await (0, supertest_1.default)(server_1.app)
                .post('/auth/register')
                .send(userData)
                .expect(400);
        });
    });
});
// LOGIN ENPOINT TEST
let accessToken = '';
(0, globals_1.describe)('POST /auth/login', () => {
    (0, globals_1.describe)('Given correct credentials', () => {
        (0, globals_1.it)('should log in the user and return a valid access token', async () => {
            const userData = {
                email: 'khazan@gmail.com',
                password: '123123'
            };
            await (0, supertest_1.default)(server_1.app)
                .post('/auth/login')
                .send(userData)
                .expect(200)
                .expect('Content-Type', /json/)
                .then((response) => {
                accessToken = response.body;
                console.log(accessToken);
            });
        });
    });
    (0, globals_1.describe)('When one or more required credentials are missing', () => {
        (0, globals_1.it)('should return a 400 error if email is missing', async () => {
            const userData = {
                password: '123123'
            };
            await (0, supertest_1.default)(server_1.app)
                .post('/auth/login')
                .send(userData)
                .expect(400)
                .expect('Content-Type', /json/)
                .then((response) => {
                (0, globals_1.expect)(response.body.message).toBe('Email is required');
            });
        });
        (0, globals_1.it)('should return a 400 error if password is missing', async () => {
            const userData = {
                email: 'khazan@gmail.com'
            };
            await (0, supertest_1.default)(server_1.app)
                .post('/auth/login')
                .send(userData)
                .expect(400)
                .expect('Content-Type', /json/)
                .then((response) => {
                (0, globals_1.expect)(response.body.message).toBe('Password is required');
            });
        });
    });
    (0, globals_1.it)('should return a 404 error if user is not found', async () => {
        const userData = {
            email: 'nonexistent@gmail.com',
            password: '123123'
        };
        await (0, supertest_1.default)(server_1.app)
            .post('/auth/login')
            .send(userData)
            .expect(404)
            .expect('Content-Type', /json/)
            .then((response) => {
            (0, globals_1.expect)(response.body.message).toBe('User not found');
        });
    });
    (0, globals_1.it)('should return a 400 error if password is incorrect', async () => {
        const userData = {
            email: 'khazan@gmail.com',
            password: 'wrongpassword'
        };
        await (0, supertest_1.default)(server_1.app)
            .post('/auth/login')
            .send(userData)
            .expect(400)
            .expect('Content-Type', /json/)
            .then((response) => {
            (0, globals_1.expect)(response.body.message).toBe('Wrong Credentials');
        });
    });
});
(0, globals_1.afterAll)(async () => {
    try {
        await mongoose_1.default.connection.close();
    }
    catch (error) {
        console.error('Error while cleaning up:', error);
    }
});
//# sourceMappingURL=auth.test.js.map