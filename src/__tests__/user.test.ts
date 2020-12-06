// Libs
import supertest from 'supertest';
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// App
import app from "../index";
const server = supertest.agent(app);

// Model
import UserModel from "../model/Users";

// Test data.
const user = {
  name: 'John',
  phone: '+380123456789'
};

// Setting mongoose.
const optMongo = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

describe('POST USER Endpoint', () => {
  beforeAll(async (done) => {
    await mongoose.connect(`${process.env.DB}`, optMongo);
    done();
  });

  afterAll(async (done) => {
    await mongoose.connection.close();
    done();
  });

  it('should return error phone message', async (done) => {
    const errorPhone = {
      name: 'John',
      phone: '+38012345678912'
    };

    const resp = await server.post('/user').send(errorPhone);

    expect(resp.status).toBe(400);
    expect(typeof resp.body).toBe('object');
    expect(resp.body).toHaveProperty('message');
    expect(resp.body.message).toBe('Please enter correct phone!');

    done();
  });

  it('should return message about user creation', async (done) => {

    const resp = await server.post('/user').send(user);

    expect(resp.status).toBe(201);
    expect(typeof resp.body).toBe('object');
    expect(resp.body).toHaveProperty('message');
    expect(resp.body.message).toBe('User has been created!');

    done();
  });

  it('should return error user message', async (done) => {
    const resp = await server.post('/user').send(user);

    expect(resp.status).toBe(400);
    expect(typeof resp.body).toBe('object');
    expect(resp.body).toHaveProperty('message');
    expect(resp.body.message).toBe('User already exist!');

    done();
  });

  it('should return false. Delete test user', async (done) => {
    await UserModel.findOneAndDelete({phone: user.phone});

    const userData = await UserModel.findOne({phone: user.phone});
    expect(userData).toBeFalsy();

    done();
  });
});
