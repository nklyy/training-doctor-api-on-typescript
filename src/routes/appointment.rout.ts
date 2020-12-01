import {Router} from 'express';

// Controllers
import AppointmentController from "../controller/appointment.controller";

const appointment = Router();

appointment.post('/', AppointmentController.MakeAppointment);

export default appointment;
