// Libs
import supertest from 'supertest';
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// App
import app from "../index";
const server = supertest.agent(app);

// Models
import UserModel from "../model/Users";
import DoctorModel from "../model/Doctors";

// Setting mongoose.
const optMongo = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

describe('POST Doctor Endpoint', () => {
  let doctorId: string;

  beforeAll(async (done) => {
    await mongoose.connect(`${process.env.DB}`, optMongo);
    done();
  });

  afterAll(async (done) => {
    await mongoose.connection.close();
    done();
  });

  it('should return error message(incorrect date)', async (done) => {
    const errorDoctorDate = {
      name: 'John',
      spec: 'therapist',
      slots: ['2020-12-3 10:00']
    };

    const resp = await server.post('/doctor').send(errorDoctorDate);

    expect(resp.status).toBe(400);
    expect(typeof resp.body).toBe('object');
    expect(resp.body).toHaveProperty('message');
    expect(resp.body.message).toBe('Doctor validation failed: slots: You entered a past date or wrong format date. Date format (yyyy-mm-dd hh:mm)');

    done();
  });

  it('should return error message array', async (done) => {
    const errorDoctorArray = {
      name: 'John',
      spec: 'therapist',
      slots: 'Hello'
    };

    const resp = await server.post('/doctor').send(errorDoctorArray);

    expect(resp.status).toBe(400);
    expect(typeof resp.body).toBe('object');
    expect(resp.body).toHaveProperty('message');
    expect(resp.body.message).toBe('Slots should be Array Date!');

    done();
  });

  it('should return successful message', async (done) => {
    const date = new Date();
    date.setHours(date.getHours() + 1);

    const doctor = {
      name: 'John',
      spec: 'therapist',
      slots: [date]
    };

    const resp = await server.post('/doctor').send(doctor);

    expect(resp.status).toBe(201);
    expect(typeof resp.body).toBe('object');
    expect(resp.body).toHaveProperty('message');
    expect(resp.body).toHaveProperty('id');
    expect(resp.body.message).toBe('Doctor has been created!');
    expect(typeof resp.body.id).toBe('string');

    doctorId = resp.body.id;

    done();
  });

  it('should return false. Delete test doctor', async (done) => {
    await DoctorModel.findOneAndDelete({_id: doctorId});

    const userData = await UserModel.findOne({_id: doctorId});
    expect(userData).toBeFalsy();

    done();
  });
});
