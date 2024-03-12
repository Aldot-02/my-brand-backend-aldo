import { app } from '../utils/server';
import supertest from 'supertest';
import { sign } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { CustomRequest } from '../Middlewares/middlewares';
import UserModel, { User } from '../Models/UserModel';
import { getUser, getAllUsers, updateUser, deleteUser } from '../Controllers/UserController'
import BlogsModel from '../Models/BlogsModel';

jest.setTimeout(20000);

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL!);
  } catch (error) {
    console.error('Error while connecting:', error);
  }
});

// afterEach(async () => {
//   try {
//     for (var i in mongoose.connection.collections) {
//       await mongoose.connection.collections[i].deleteMany({});
//     }
//   } catch (error) {
//     console.error('Error while cleaning up:', error);
//   }
// });

// afterAll(async () => {
//   try {
    
//     await mongoose.connection.close();
//   } catch (error) {
//     console.error('Error while closing:', error);
//   }
// });

// REGISTERING A USER TEST

describe('POST /auth/register', () => {
    describe('Given all required credentials', () => {
        it('should create a new user when all required credentials are provided', async () => {
            const userData = {
                firstname: 'TTC',
                lastname: 'khazan1',
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
                    expect(response.body.email).toBe(userData.email);
    
                    expect(response.body).toHaveProperty('_id');
    
                    const savedUser = await UserModel.findOne({ email: userData.email });
                    expect(savedUser).toBeTruthy();
                });
        });
    });
    
    describe('When one or more required credentials are missing', () => {
        it('should return a 400 error if firstname is missing', async () => {
            const userData = {
                lastname: 'khazan',
                email: 'khazan@gmail.com',
                password: '123123'
            };

            await supertest(app)
                .post('/auth/register')
                .send(userData)
                .expect(400);
        });

        it('should return a 400 error if lastname is missing', async () => {
            const userData = {
                firstname: 'TTC',
                email: 'khazan@gmail.com',
                password: '123123'
            };

            await supertest(app)
                .post('/auth/register')
                .send(userData)
                .expect(400);
        });

        it('should return a 400 error if email is missing', async () => {
            const userData = {
                firstname: 'TTC',
                lastname: 'khazan',
                password: '123123'
            };

            await supertest(app)
                .post('/auth/register')
                .send(userData)
                .expect(400);
        });

        it('should return a 400 error if password is missing', async () => {
            const userData = {
                firstname: 'TTC',
                lastname: 'khazan',
                email: 'khazan@gmail.com'
            };

            await supertest(app)
                .post('/auth/register')
                .send(userData)
                .expect(400);
        });
    });
});

// LOGIN ENPOINT TEST

let accessToken = '';

describe('POST /auth/login', () => {
  describe('Given correct credentials', () => {
    it('should log in the user and return a valid access token', async () => {
      const userData = {
          email: 'khazan@gmail.com',
          password: '123123'
      };
  
      await supertest(app)
          .post('/auth/login')
          .send(userData)
          .expect(200)
          .expect('Content-Type', /json/)
          .then((response) => {
              accessToken = response.body;
  
              expect(accessToken).toBeTruthy();
  
              const tokenParts = accessToken.split('.');
              expect(tokenParts.length).toBe(3);
          });
  });
  
  });

  describe('When one or more required credentials are missing', () => {
      it('should return a 400 error if email is missing', async () => {
          const userData = {
              password: '123123'
          };

          await supertest(app)
              .post('/auth/login')
              .send(userData)
              .expect(400)
              .expect('Content-Type', /json/)
              .then((response) => {
                  expect(response.body.message).toBe('Email is required');
              });
      });

      it('should return a 400 error if password is missing', async () => {
          const userData = {
              email: 'khazan@gmail.com'
          };

          await supertest(app)
              .post('/auth/login')
              .send(userData)
              .expect(400)
              .expect('Content-Type', /json/)
              .then((response) => {
                  expect(response.body.message).toBe('Password is required');
              });
      });
  });

  it('should return a 404 error if user is not found', async () => {
      const userData = {
          email: 'nonexistent@gmail.com',
          password: '123123'
      };

      await supertest(app)
          .post('/auth/login')
          .send(userData)
          .expect(404)
          .expect('Content-Type', /json/)
          .then((response) => {
              expect(response.body.message).toBe('User not found');
          });
  });

  it('should return a 400 error if password is incorrect', async () => {
      const userData = {
          email: 'khazan@gmail.com',
          password: 'wrongpassword'
      };

      await supertest(app)
          .post('/auth/login')
          .send(userData)
          .expect(400)
          .expect('Content-Type', /json/)
          .then((response) => {
              expect(response.body.message).toBe('Wrong Credentials');
          });
  });
});


// TESTING USERS

describe('/user/', () => {
    describe('Getting a Single user Route', () => {
        describe('Retrieve a user by ID', () => {
            it('should return a user when given an existing user ID', async () => {
                const req = { params: { id: '658a1e881d73fc245780dc4f' } } as unknown as Request;
                const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
            
                await getUser(req as CustomRequest, res);
            
                expect(res.status).toHaveBeenCalledWith(200);
            });

            it('should return a 404 when given a non-existent user ID', async () => {
                const req = { params: { id: '658a1e881d73fc245780dc4e' } } as unknown as Request;
                const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

                await getUser(req as CustomRequest, res);

                expect(res.sendStatus(404))
            });
        });
    });

    describe('Retrieve all users Route', () => {
        it('should return a 200 and an array of users if users exist', async () => {
    const req = {} as Request;
    const res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) } as unknown as Response;

    UserModel.find = jest.fn().mockResolvedValue([{ name: 'user1' }, { name: 'user2' }] as unknown as User[]);

    await getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith([{ name: 'user1' }, { name: 'user2' }]);
});

        it('should return a 200 and an empty array if no users exist', async () => {
            const req = {} as Request;
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;

            UserModel.find = jest.fn().mockResolvedValue([] as User[]);

            await getAllUsers(req, res);

            expect(res.sendStatus(200))
        });
    });

    describe('Update a user by ID', () => {
        it('should update a user when given valid data and permissions', async () => {
            const req = { params: { id: 'validUserID' }, user: { _id: 'validUserID', isAdmin: true }, body: { firstname: "Aldo" } } as unknown as CustomRequest;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            UserModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ firstname: "Aldo" } as User);

            await updateUser(req, res);

            expect(res.status).toBe(200);
        });

        it('should return a 403 if the user is not allowed to update', async () => {
            const req = { params: { id: 'validUserID' }, user: { _id: 'anotherUserID', isAdmin: false }, body: { firstname: "Aldo" } } as unknown as CustomRequest;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            await updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    describe('Delete a user by ID', () => {
        it('should delete a user when given valid data and permissions', async () => {
            const req = { params: { id: 'validUserID' }, user: { _id: 'validUserID', isAdmin: true } } as unknown as CustomRequest;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            UserModel.findByIdAndDelete = jest.fn().mockResolvedValue({ message: 'Account deleted successfully' });

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return a 403 if the user is not allowed to delete', async () => {
            const req = { params: { id: 'validUserID' }, user: { _id: 'anotherUserID', isAdmin: false } } as unknown as CustomRequest;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });
    });
});


// BLOGS TESTING

describe('Blogs Endpoints', () => {
beforeAll(async () => {
    const userData = {
        email: 'khazan@gmail.com',
        password: '123123'
    };

    await supertest(app)
        .post('/auth/login')
        .send(userData)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
            accessToken = response.body;

            expect(accessToken).toBeTruthy();

            const tokenParts = accessToken.split('.');
            expect(tokenParts.length).toBe(3);
        });
});


    describe('POST /blog/', () => {
        it('should create a new blog post', async () => {
            const blogData = {
                author: 'Random name',
                title: 'New Blog Post',
                content: 'Lorem ipsum dolor sit amet.',
                coverImage: 'https://example.com/image.jpg'
            };
    
            await supertest(app)
                .post('/blog/')
                .set('Authorization', 'Bearer ' + accessToken)
                .send(blogData)
                .expect('Content-Type', /json/)
                .expect(200);
        });
        

        it('should return 401 Unauthorized if no access token is provided', async () => {
            const blogData = {
                author: 'John Doe',
                title: 'New Blog Post',
                content: 'Lorem ipsum dolor sit amet.',
                coverImage: 'https://example.com/image.jpg'
            };

            await supertest(app)
                .post('/blog/')
                .send(blogData)
                .expect(401);
        });
    });

    describe('GET /blog/all', () => {
        it('should retrieve all blog posts', async () => {
            await supertest(app)
                .get('/blog/all')
                .expect(200)
                .expect('Content-Type', /json/)
                .then((response) => {
                });
        });
    });

    describe('GET /blog/:id', () => {
        it('should retrieve a specific blog post by ID', async () => {
            const validBlogId = '60e97c9fcf5c026b848860d3';
    
            await supertest(app)
                .get(`/blog/${validBlogId}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .then((response) => {
                    // Add assertions based on the expected behavior of your application
                });
        });
    
        it('should return 404 Not Found if the blog post ID does not exist', async () => {
            const nonExistentBlogId = '1234567890';
    
            await supertest(app)
                .get(`/blog/${nonExistentBlogId}`)
                .expect(404)
                .expect('Content-Type', /json/)
                .then((response) => {
                    // Add assertions based on the expected behavior of your application
                });
        });
    });
    
    describe('PATCH /blog/:id', () => {
        it('should update a specific blog post by ID', async () => {
            const validBlogId = '60e97c9fcf5c026b848860d3';
            const updatedData = {
                title: 'Updated Title'
            };
    
            const response = await supertest(app)
                .patch(`/blog/${validBlogId}`)
                .set('Authorization', 'Bearer ' + accessToken)
                .send(updatedData)
                .expect(200)
                .expect('Content-Type', /json/)
                .then((response) => {
                    // Add assertions based on the expected behavior of your application
                });
        });
    
        it('should return 404 Not Found if the blog post ID does not exist', async () => {
            const nonExistentBlogId = '1234567890';
    
            const response = await supertest(app)
                .patch(`/blog/${nonExistentBlogId}`)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(404)
                .expect('Content-Type', /json/)
                .then((response) => {
                    // Add assertions based on the expected behavior of your application
                });
        });
    });
    
    describe('DELETE /blog/:id', () => {
        it('should delete a specific blog post by ID', async () => {
            const validBlogId = '60e97c9fcf5c026b848860d3';
    
            const response = await supertest(app)
                .delete(`/blog/${validBlogId}`)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(200)
                .expect('Content-Type', /json/)
                .then((response) => {
                    // Add assertions based on the expected behavior of your application
                });
        });
    
        it('should return 404 Not Found if the blog post ID does not exist', async () => {
            const nonExistentBlogId = '1234567890';
    
            const response = await supertest(app)
                .delete(`/blog/${nonExistentBlogId}`)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(404)
                .expect('Content-Type', /json/)
                .then((response) => {
                    // Add assertions based on the expected behavior of your application
                });
        });
    });
});



afterAll(async () => {
  try {
      for (const collection in mongoose.connection.collections) {
          await mongoose.connection.collections[collection].deleteMany({});
      }
      await mongoose.connection.close();
  } catch (error) {
      console.error('Error while cleaning up:', error);
  }
});