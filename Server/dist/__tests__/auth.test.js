import supertest from "supertest";
import { app } from '../utils/server.js';
import UserModel from '../Models/UserModel.js';
import { createConnection } from "mongoose";
let connection, server;
beforeAll(async () => {
    connection = await createConnection();
    await connection.dropDatabase();
    server = app.listen(process.env.PORT);
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
            await supertest(app)
                .post('/auth/register')
                .send(userData)
                .expect(200)
                .expect('Content-Type', /json/)
                .then(async (response) => {
                expect(response.body).toMatchObject(userData);
                const savedUser = await UserModel.findOne({ email: userData.email });
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
            await supertest(app)
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
            await supertest(app)
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
            await supertest(app)
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
            await supertest(app)
                .post('/auth/register')
                .send(userData)
                .expect(400);
        });
    });
});
//# sourceMappingURL=auth.test.js.map