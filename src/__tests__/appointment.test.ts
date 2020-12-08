// Libs
import supertest from 'supertest';
import mongoose from "mongoose";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();

// App
import app from "../index";

const server = supertest.agent(app);

// Models
import UserModel from "../model/Users";
import DoctorModel from "../model/Doctors";

// Interfaces
import {IUsers} from 'interfaces/IUsers';
import {IDoctors} from "../interfaces/IDoctors";

// Setting mongoose.
const optMongo = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

describe('POST Doctor appointment Endpoint', () => {
  let user: IUsers & mongoose.Document;
  let doctor: IDoctors & mongoose.Document;

  beforeAll(async (done) => {
    await mongoose.connect(`${process.env.DB}`, optMongo);

    const date = new Date();
    date.setHours(date.getHours() + 1);
    date.setSeconds(0);
    date.setMilliseconds(0);

    user = await UserModel.create({name: 'John', phone: '+380123456789'});
    doctor = await DoctorModel.create({name: 'John', spec: 'therapist', slots: [date]});

    done();
  });

  afterAll(async (done) => {
    await UserModel.findOneAndDelete({_id: user._id});
    await DoctorModel.findOneAndDelete({_id: doctor._id});

    await mongoose.connection.close();

    done();
  });

  it('should return error format message', async (done) => {
    const IncorrectFormatDate = {
      user_id: user._id,
      doctor_id: doctor._id,
      slot: "123"
    };

    const resp = await server.post('/appointment').send(IncorrectFormatDate);

    expect(resp.status).toBe(400);
    expect(typeof resp.body).toBe('object');
    expect(resp.body).toHaveProperty('message');
    expect(resp.body.message).toBe('Please enter correct date or time. Format date/time (yyyy-mm-dd hh:mm)');

    done();
  });

  it('should return error user message', async (done) => {
    const IncorrectUser = {
      user_id: "5fc8e3c26150843ab8021191",
      doctor_id: doctor._id,
      slot: "2020-12-05 10:00"
    };

    const resp = await server.post('/appointment').send(IncorrectUser);

    expect(resp.status).toBe(400);
    expect(typeof resp.body).toBe('object');
    expect(resp.body).toHaveProperty('message');
    expect(resp.body.message).toBe('User not found!');

    done();
  });

  it('should return error doctor message', async (done) => {
    const IncorrectUser = {
      user_id: user._id,
      doctor_id: "5fc66d5b1cd74122a4ef0000",
      slot: "2020-12-05 10:00"
    };

    const resp = await server.post('/appointment').send(IncorrectUser);

    expect(resp.status).toBe(400);
    expect(typeof resp.body).toBe('object');
    expect(resp.body).toHaveProperty('message');
    expect(resp.body.message).toBe('Doctor not found!');

    done();
  });

  it('should return error date/time message', async (done) => {
    const IncorrectDateTime = {
      user_id: user._id,
      doctor_id: doctor._id,
      slot: "2020-12-05 10:00"
    };

    const resp = await server.post('/appointment').send(IncorrectDateTime);

    expect(resp.status).toBe(400);
    expect(typeof resp.body).toBe('object');
    expect(resp.body).toHaveProperty('message');
    expect(typeof resp.body.message).toBe('string');

    done();
  });

  it('should return successful', async (done) => {
    const CorrectData = {
      user_id: user._id,
      doctor_id: doctor._id,
      slot: moment(doctor.slots[0]).format('YYYY-MM-DD HH:mm')
    };

    const resp = await server.post('/appointment').send(CorrectData);

    expect(resp.status).toBe(201);
    expect(typeof resp.body).toBe('object');
    expect(resp.body).toHaveProperty('message');
    expect(resp.body.message).toBe(`You were booked to the doctor: ${doctor.name}. Have a good day!`);

    const checkDocDate = await DoctorModel.findOne({_id: doctor.id, slots: doctor.slots[0]});
    expect(checkDocDate).toBeFalsy();

    done();
  });
});
