import { app } from '../utils/server';
import mongoose from 'mongoose';
import BlogsModel, { Blog } from "../Models/BlogsModel";
import request from "supertest";
import { describe, expect, it, afterAll, beforeEach } from "@jest/globals";
import { Response } from "supertest";

jest.setTimeout(20000);

let token: string | undefined;

// BLOGS TESTING
describe('Blogs Endpoints', () => {
    beforeAll(async () => {
        try {
          await mongoose.connect(process.env.MONGODB_URL!);
        } catch (error) {
          console.error('Error while connecting:', error);
        }
    });

    let blog: Blog | null = null;

    beforeEach(async () => {
        blog = await BlogsModel.findOne();
        const loginResponse: Response = await request(app)
        .post("/auth/login")
        .send({ email: "twizald.02@gmail.com", password: "123123" });

        token = loginResponse.body.accessToken;
        console.log(token);
        console.log(loginResponse.body)

    });

    it('should not create a blog given incorrect token', async () => {
      const invalidAccessToken = 'invalid_access_token';
      const response = await request(app)
              .post('/blog/')
              .set("Cookie", `access=${invalidAccessToken}`)
              .send({
                author: "Fezag",
                title: "This should create a blog",
                content: "Testing successful blog creation",
                coverImage: "https://image2.png",
              });
          expect(response.status).toBe(401);
          expect(response.body.message).toBe('unauthenticated');
  
    });

    it('POST /blog/ should create a blog', async () => {
      const response = await request(app)
        .post("/blog/")
        .set("Cookie", `access=${token}`)
        .send({
          author: "Fezag",
          title: "This should create a blog",
          content: "Testing successful blog creation",
          coverImage: "https://image2.png",
        });
      expect(response.statusCode).toBe(200);
  });

  it("should not create blog given missing the title", async () => {
    const response = await request(app)
      .post("/blog/")
      .set("Cookie", `access=${token}`)
      .send({
        author: "Fezag",
        content: "Testing successful blog creation",
        coverImage: "https://image2.png",
      });
    expect(response.status).toBe(500);
  });
  it("should not create blog given missing the author", async () => {
    const response = await request(app)
      .post("/blog/")
      .set("Cookie", `access=${token}`)
      .send({
        title: "This should create a blog",
        content: "Testing successful blog creation",
        coverImage: "https://image2.png",
      });
    expect(response.status).toBe(500);
  });
  it("should not create blog given missing the content", async () => {
    const response = await request(app)
      .post("/blog/")
      .set("Cookie", `access=${token}`)
      .send({
        author: "Fezag",
        title: "This should create a blog",
        coverImage: "https://image2.png",
      });
    expect(response.status).toBe(500);
  });
  it("should not create blog given missing the coverImage", async () => {
    const response = await request(app)
      .post("/blog/")
      .set("Cookie", `access=${token}`)
      .send({
        author: "Fezag",
        title: "This should create a blog",
        content: "Testing successful blog creation",
      });
    expect(response.status).toBe(500);
  });

    it('GET /blog/all', async () => {
        const response = await request(app).get("/blog/all");
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toMatchObject({
          _id: expect.any(String),
          title: expect.any(String),
          content: expect.any(String),
          coverImage: expect.any(String),
          likes: expect.any(Array),
          comments: expect.any(Array),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: expect.any(Number),
        });
    });

    test("GET /blog/:id should retrieve a specific blog post by ID", async () => {
      const response = await request(app).get(`/blog/${blog?._id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        _id: expect.any(String),
        title: expect.any(String),
        content: expect.any(String),
        coverImage: expect.any(String),
        likes: expect.any(Array),
        comments: expect.any(Array),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: expect.any(Number),
      });
    });

    it('PATCH /blog/:id should not create a blog given incorrect token', async () => {
      const invalidAccessToken = 'invalid_access_token';
      const updatedTitle = "Updated Test Blog testing test";
      const response = await request(app)
              .patch(`/blog/${blog?._id}`)
              .set("Cookie", `access=${invalidAccessToken}`)
              .send({
                title: updatedTitle,
              });
          expect(response.status).toBe(401);
          expect(response.body.message).toBe('unauthenticated');
  
    });

    it("PATCH /blog/:id should update a specific blog post by ID", async () => {
      const updatedTitle = "Updated Test Blog testing test";
  
      const response = await request(app)
        .patch(`/blog/${blog?._id}`)
        .set("Cookie", `access=${token}`)
        .send({
          title: updatedTitle,
        });
  
      expect(response.status).toBe(200);
    });

    it("PATCH /blog/:nonexisting id shouldn't update a blog if the blog post ID does not exist", async () => {
      const updatedTitle = "Updated Test Blog";
  
      const response = await request(app)
        .patch('/blog/80984808049899')
        .set("Cookie", `access=${token}`)
        .send({
          title: updatedTitle,
        });
  
      expect(response.status).toBe(500);
    });

    it("should get blog by invalid blog id", async () => {
      const response = await request(app).get("/blog/invalid");
      expect(response.status).toBe(500);
    });


    // liking functionality
    it("should likes a blog if it exist", async () => {
      const response = await request(app)
        .patch(`/blog/${blog?._id}/like`)
        .set("Cookie", `access=${token}`);

      expect(response.status).toBe(200);
    });

    it("should not allow liking an invalid or not found blog", async () => {
      const response = await request(app)
        .patch(`/blog/65f31721b60056ba8c00e78c/like`)
        .set("Cookie", `access=${token}`);
  
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Blog Post Not Found");
    });

    it("should not be allowed to like a blog if not authenticated", async () => {
      const response = await request(app)
        .patch(`/blog/invalidBlog/like`)
        .set("Cookie", `access=${token}`);

      expect(response.status).toBe(500);
    });


        // COMMENTING FUNCTIONALITY
    it("should create a comment given the blog exist", async () => {
      const response = await request(app)
      .post(`/blog/${blog?._id}/comment`)
      .set("Cookie", `access=${token}`)
        .send({
          message: "This blog should have the reaction message",
        });
  
      expect(response.status).toBe(200);
    });
    
    it("should not create a comment if the blog is invalid or not found", async () => {
      const response = await request(app)
        .post(`/blog/65f31721b60056ba8c00e78c/comment`)
        .set("Cookie", `access=${token}`)
        .send({
          message: "This blog should have the reaction message",
        });
  
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Blog Post Not Found");
    });

    it("should return 500 when given invalid blog id while attempting to create a comment", async () => {
      const response = await request(app)
      .post(`/blog/invalidId/comment`)
      .set("Cookie", `access=${token}`)
        .send({
          message: "This blog should have the reaction message",
        });
  
      expect(response.status).toBe(500);
    });


    // GETTING BLOG'S COMMENTS FUNCTIONALITY
    it("should get all comments for a specific blog by passing in its id", async () => {
      const response = await request(app)
        .get(`/blog/${blog?._id}/comments`)
        .set("Cookie", `access=${token}`);
  
      expect(response.status).toBe(200);          
    });

    it("should return 404 if trying to comment on unexisting blog", async () => {
      const response = await request(app)
        .get(`/blog/65f31721b60056ba8c00e78c/comments`)
        .set("Cookie", `access=${token}`)
  
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Blog Post Not Found");
    });

    it("should return 500 when given invalid blog id while attempting to fetch or get or display its comments", async () => {
      const response = await request(app)
      .get(`/blog/invalidId/comments`)
      .set("Cookie", `access=${token}`)
  
      expect(response.status).toBe(500);
    });


        // DELETING COMMENT FUNCTIONALITY

    it('should not delete a blog given incorrect token', async () => {
      const invalidAccessToken = 'invalid_access_token';
      const response = await request(app)
              .delete(`/blog/${blog?._id}`)
              .set("Cookie", `access=${invalidAccessToken}`)
          expect(response.status).toBe(401);
          expect(response.body.message).toBe('unauthenticated');
  
    });

    it("delete blog by invalid blog id", async () => {
      const response = await request(app)
        .delete("/blog/invalid")
        .set("Cookie", `access=${token}`)
      expect(response.status).toBe(500);
    });
    it("delete blog by not found blog id", async () => {
      const response = await request(app)
        .delete("/blog/65ef6a3afc8ace8dbe144fc4")
        .set("Cookie", `access=${token}`)
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Blog Post Not Found");
    });
    it("delete blog if found", async () => {
      const response = await request(app)
        .delete(`/blog/${blog?._id}`)
        .set("Cookie", `access=${token}`)
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Blog Post Successfully deleted");
    });


    afterAll(async () => {
        try {
            await mongoose.connection.close();
        } catch (error) {
            console.error('Error while cleaning up:', error);
        }
    });
});
