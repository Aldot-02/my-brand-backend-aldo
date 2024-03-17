import { app } from '../utils/server';
import mongoose from 'mongoose';
import UserModel, { User } from '../Models/UserModel';
import request from "supertest";
import { describe, expect, it, afterAll, beforeEach } from "@jest/globals";
import { Response } from "supertest";

jest.setTimeout(20000);
// USERS TESTING

let token: string | undefined;

// BLOGS TESTING
describe('Users Endpoints', () => {
    beforeAll(async () => {
        try {
          await mongoose.connect(process.env.MONGODB_URL!);
        } catch (error) {
          console.error('Error while connecting:', error);
        }
    });

    let user: User | null = null;

    beforeEach(async () => {
        user = await UserModel.findOne();
        const loginResponse: Response = await request(app)
        .post("/auth/login")
        .send({ email: "twizald.02@gmail.com", password: "123123" });

        token = loginResponse.body.accessToken;
        console.log(token);
        console.log(loginResponse.body)

    });

    it('should not get all users given incorrect token', async () => {
        const invalidAccessToken = 'invalid_access_token';
        const response = await request(app)
                .get('/user/')
                .set("Cookie", `access=${invalidAccessToken}`);
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('unauthenticated');
    
    });

    it('GET /user/ should get all users given the admin permission', async () => {
        const response = await request(app)
            .get("/user/")
            .set("Cookie", `access=${token}`)
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toMatchObject({
          _id: expect.any(String),
          firstname: expect.any(String),
          lastname: expect.any(String),
          email: expect.any(String),
          isAdmin: expect.any(Boolean),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: expect.any(Number),
        });
    });   

    it('should not get user information given incorrect token', async () => {
        const invalidAccessToken = 'invalid_access_token';
        const response = await request(app)
                .get('/user/${user?._id}')
                .set("Cookie", `access=${invalidAccessToken}`);
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('unauthenticated');
    
    });

    it("should get a user by user role or admin role given user id", async () => {
    const response = await request(app)
        .get(`/user/${user?._id}`)
        .set("Cookie", `access=${token}`);
    expect(response.statusCode).toBe(200);
    });

    
    it("get user by not found id", async () => {
    const response = await request(app)
        .get(`/user/65f39f9fb3fdfd182ba2a885`)
        .set("Cookie", `access=${token}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("User Doesn't exist");
    });

    it("should not get a user without authentication", async () => {
        const response = await request(app).get(`/user/${user?._id}`);
        expect(response.statusCode).toBe(401);
    });

    it("should not get a user given no permission to do so", async () => {
    const response = await request(app)
        .get(`/user/invalidUserId`)
        .set("Cookie", `access=${token}`);
    expect(response.statusCode).toBe(500);
    });

    it("should get an authenticated user profile", async () => {
        const response = await request(app)
            .get("/user/profile")
            .set("Cookie", `access=${token}`);
        expect(response.statusCode).toBe(200);
    });

    it("should not get an unauthenticated user profile", async () => {
        const response = await request(app)
            .get("/user/profile")
        expect(response.statusCode).toBe(401);
    });

    // UPDATING A USER

    it('should not update user information given incorrect token', async () => {
        const invalidAccessToken = 'invalid_access_token';
        const response = await request(app)
                .patch('/user/${user?._id}')
                .set("Cookie", `access=${invalidAccessToken}`);
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('unauthenticated');
    
    });

    it("PATCH /user/:id should update a specific blog post by ID", async () => {
        const updatedFirstName = "Telephone Name";
    
        const response = await request(app)
          .patch(`/user/${user?._id}`)
          .set("Cookie", `access=${token}`)
          .send({
            firstname: updatedFirstName,
          });
    
        expect(response.status).toBe(200);
    });

    // Should not update an unexisting user
    it("PATCH /user/:nonexisting id shouldn't update a user if the user ID does not exist", async () => {
        const updatedFirstName = "Unexisting blog";
    
        const response = await request(app)
          .patch('/user/80984808049899')
          .set("Cookie", `access=${token}`)
          .send({
            firstname: updatedFirstName,
          });
    
        expect(response.status).toBe(500);
    });


    // deleting
    it('should not delete user information given incorrect token', async () => {
        const invalidAccessToken = 'invalid_access_token';
        const response = await request(app)
                .delete('/user/${user?._id}')
                .set("Cookie", `access=${invalidAccessToken}`);
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('unauthenticated');
    
    });

    it("delete user by invalid user id", async () => {
        const response = await request(app)
          .delete("/user/invalid")
          .set("Cookie", `access=${token}`)
        expect(response.status).toBe(500);
    });
    
    // it("delete user if found with proper permissions", async () => {
    //     const response = await request(app)
    //       .delete(`/user/${user?._id}`)
    //       .set("Cookie", `access=${token}`)
    //     expect(response.status).toBe(200);
    //     expect(response.body.message).toBe("Account deleted successfully");
    // });





    afterAll(async () => {
        try {
            await mongoose.connection.close();
        } catch (error) {
            console.error('Error while cleaning up:', error);
        }
    });
});