import { app } from '../utils/server';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { describe, expect, it, afterAll } from "@jest/globals";

jest.setTimeout(20000);

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL!);
  } catch (error) {
    console.error('Error while connecting:', error);
  }
});

// REGISTERING A USER TEST

describe('POST /auth/register', () => {
    describe('Given all required credentials', () => {

        it('should return error when the account already exist.', async () => {
            const userData = {
                firstname: 'Aldo',
                lastname: 'Twizerimana',
                email: 'twizald.02@gmail.com',
                password: '123123',
                isAdmin: true
            };
    
            const response = await supertest(app)
                .post('/auth/register')
                .send(userData)
            expect(response.status).toBe(409);
            expect(response.body.message).toBe("Account already exists with this email.");
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
    
    describe('When one or more required credentials are missing', () => {
        it('should return a 400 error if firstname is missing', async () => {
            const userData = {
                lastname: 'Twizerimana',
                email: 'twizald.02@gmail.com',
                password: '123123'
            };

            await supertest(app)
                .post('/auth/register')
                .send(userData)
                .expect(400);
        });

        it('should return a 400 error if lastname is missing', async () => {
            const userData = {
                firstname: 'Aldo',
                email: 'twizald.02@gmail.com',
                password: '123123'
            };

            await supertest(app)
                .post('/auth/register')
                .send(userData)
                .expect(400);
        });

        it('should return a 400 error if email is missing', async () => {
            const userData = {
                firstname: 'Aldo',
                lastname: 'Twizerimana',
                password: '123123'
            };

            await supertest(app)
                .post('/auth/register')
                .send(userData)
                .expect(400);
        });

        it('should return a 400 error if password is missing', async () => {
            const userData = {
                firstname: 'Aldo',
                lastname: 'Twizerimana',
                email: 'twizald.02@gmail.com'
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
          email: 'twizald.02@gmail.com',
          password: '123123'
      };
  
      await supertest(app)
          .post('/auth/login')
          .send(userData)
          .expect(200)
          .expect('Content-Type', /json/)
          .then((response) => {
              accessToken = response.body;
              console.log(accessToken)
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
              email: 'twizald.02@gmail.com'
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
          email: 'twizald.02@gmail.com',
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


afterAll(async () => {
  try {
      await mongoose.connection.close();
  } catch (error) {
      console.error('Error while cleaning up:', error);
  }
});