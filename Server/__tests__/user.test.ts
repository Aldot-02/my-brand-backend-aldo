import supertest from 'supertest'
import {app} from '../utils/server.js'
import { createConnection } from 'mongoose';


let connection: any, server: any;

beforeAll(async () => {
    connection = await createConnection();
    await connection.dropDatabase();
    server = app.listen(process.env.PORT)
});

afterAll(() => {
    connection.close();
    server.close();
});

describe('User', () => {
    describe('Getting a Single user Route', () => {
        describe('Retrieve a user by ID', () => {
            it('should return a user when given an existing user ID', async () => {
                const userId = "existing-user-id";
                const expectedUser = {
                    firstname: '',
                    lastname: '',
                    email: '',
                    password: ''
                };
        
                await supertest(app)
                .get(`/user/${userId}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .then((response) => {
                    expect(response.body).toEqual(expect.objectContaining(expectedUser));
                });
            });
    
            it('should return a 404 when given a non-existent user ID', async () => {
                const userId = "nonexistent-user-id";
    
                await supertest(app)
                .get(`/user/${userId}`)
                .expect(404);
            });
        });
    });

    describe('Retrieve all users Route', () => {
        it('should return a 200 and an array of users if users exist', async () => {
            await supertest(app)
            .get('/user')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toBeInstanceOf(Array);
                expect(response.body.length).toBeGreaterThan(0);
            });
        });

        it('should return a 200 and an empty array if no users exist', async () => {
            await supertest(app)
            .get('/user')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toBeInstanceOf(Array);
                expect(response.body.length).toBe(0);
            });
        });
    });

    describe('Update a user by ID', () => {
        it('should update a user when given valid data and permissions', async () => {
            const userId = "";
            const currentUserId = "";
        
            const updatedUserData = {
                firstname: '',
                lastname: '',
                email: '',
            };
        
            await supertest(app)
                .patch(`/user/${userId}`)
                .send({
                    currentUserId: currentUserId,
                    currentUserAdminStatus: true,
                    ...updatedUserData,
                })
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining(updatedUserData));
            });
        });        

        it('should return a 403 if the user is not allowed to update', async () => {
            const userId = "";
            const currentUserId = "";

            await supertest(app)
                .patch(`/user/${userId}`)
                .send({
                    currentUserId: currentUserId,
                    currentUserAdminStatus: false,
            })
            .expect(403);
        });
    });

    describe('Delete a user by ID', () => {
        it('should delete a user when given valid data and permissions', async () => {
            const userId = "";
            const currentUserId = "";

            await supertest(app)
            .delete(`/user/${userId}`)
            .send({
                currentUserId: currentUserId,
                currentUserAdminStatus: true,
            })
            .expect(200);
        });

        it('should return a 403 if the user is not allowed to delete', async () => {
            const userId = "";
            const currentUserId = "";

            await supertest(app)
            .delete(`/user/${userId}`)
            .send({
                currentUserId: currentUserId,
                currentUserAdminStatus: false,
            })
            .expect(403);
        });
    });
});