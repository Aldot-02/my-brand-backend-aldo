"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../utils/server");
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const globals_1 = require("@jest/globals");
const UserModel_1 = __importDefault(require("../Models/UserModel"));
const supertest_2 = __importDefault(require("supertest"));
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
                firstname: 'Aldo',
                lastname: 'Twizerimana',
                email: 'twizald.02@gmail.com',
                password: '123123',
                isAdmin: true
            };
            const response = await (0, supertest_1.default)(server_1.app)
                .post('/auth/register')
                .send(userData);
            (0, globals_1.expect)(response.status).toBe(409);
            (0, globals_1.expect)(response.body.message).toBe("Account already exists with this email.");
        });
        // it('should create a new user when all required credentials are provided', async () => {
        //     const userData = {
        //         firstname: 'Aldo',
        //         lastname: 'Twizerimana',
        //         email: 'twizald.02@gmail.com',
        //         password: '123123',
        //         isAdmin: true
        //     };
        //     await supertest(app)
        //         .post('/auth/register')
        //         .send(userData)
        //         .expect(200)
        //         .expect('Content-Type', /json/)
        //         .then(async (response) => {    
        //             expect(response.body).toHaveProperty('_id');
        //             });
        // });
    });
    (0, globals_1.describe)('When one or more required credentials are missing', () => {
        (0, globals_1.it)('should return a 400 error if firstname is missing', async () => {
            const userData = {
                lastname: 'Twizerimana',
                email: 'twizald.02@gmail.com',
                password: '123123'
            };
            await (0, supertest_1.default)(server_1.app)
                .post('/auth/register')
                .send(userData)
                .expect(400);
        });
        (0, globals_1.it)('should return a 400 error if lastname is missing', async () => {
            const userData = {
                firstname: 'Aldo',
                email: 'twizald.02@gmail.com',
                password: '123123'
            };
            await (0, supertest_1.default)(server_1.app)
                .post('/auth/register')
                .send(userData)
                .expect(400);
        });
        (0, globals_1.it)('should return a 400 error if email is missing', async () => {
            const userData = {
                firstname: 'Aldo',
                lastname: 'Twizerimana',
                password: '123123'
            };
            await (0, supertest_1.default)(server_1.app)
                .post('/auth/register')
                .send(userData)
                .expect(400);
        });
        (0, globals_1.it)('should return a 400 error if password is missing', async () => {
            const userData = {
                firstname: 'Aldo',
                lastname: 'Twizerimana',
                email: 'twizald.02@gmail.com'
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
                email: 'twizald.02@gmail.com',
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
                email: 'twizald.02@gmail.com'
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
            email: 'twizald.02@gmail.com',
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
(0, globals_1.describe)('GET /auth/authenticated', () => {
    let user = null;
    let token;
    (0, globals_1.beforeEach)(async () => {
        user = await UserModel_1.default.findOne();
        const loginResponse = await (0, supertest_2.default)(server_1.app)
            .post("/auth/login")
            .send({ email: "twizald.02@gmail.com", password: "123123" });
        token = loginResponse.body.accessToken;
        console.log(token);
        console.log(loginResponse.body);
    });
    (0, globals_1.it)('should return the authenticated user when a valid access token is provided', async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .get('/auth/authenticated')
            .set("Cookie", `access=${token}`);
        const user = (0, globals_1.expect)(response.body).toMatchObject({
            _id: globals_1.expect.any(String),
            firstname: globals_1.expect.any(String),
            lastname: globals_1.expect.any(String),
            password: globals_1.expect.any(String),
            email: globals_1.expect.any(String),
            isAdmin: globals_1.expect.any(Boolean),
            createdAt: globals_1.expect.any(String),
            updatedAt: globals_1.expect.any(String),
            __v: globals_1.expect.any(Number),
        });
        (0, globals_1.expect)(response.statusCode).toBe(200);
    });
    (0, globals_1.it)('should return 401 "unauthenticated" when no access token is provided', async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .get('/auth/authenticated');
        (0, globals_1.expect)(response.status).toBe(401);
        (0, globals_1.expect)(response.body.message).toBe('unauthenticated');
    });
    (0, globals_1.it)('should return 401 "unauthenticated" when the access token is invalid or expired', async () => {
        const invalidAccessToken = 'invalid_access_token';
        const response = await (0, supertest_1.default)(server_1.app)
            .get('/auth/authenticated')
            .set("Cookie", `access=${invalidAccessToken}`);
        (0, globals_1.expect)(response.status).toBe(401);
        (0, globals_1.expect)(response.body.message).toBe('unauthenticated');
    });
});
let token;
(0, globals_1.describe)('POST /auth/refresh', () => {
    let user = null;
    (0, globals_1.beforeEach)(async () => {
        user = await UserModel_1.default.findOne();
        const loginResponse = await (0, supertest_2.default)(server_1.app)
            .post("/auth/login")
            .send({ email: "twizald.02@gmail.com", password: "123123" });
        token = loginResponse.body.accessToken;
        console.log(token);
        console.log(loginResponse.body);
    });
    (0, globals_1.it)('should log a user out', async () => {
        const response = await (0, supertest_1.default)(server_1.app)
            .post('/auth/logout');
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.body.message).toBe('Logout was successful');
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