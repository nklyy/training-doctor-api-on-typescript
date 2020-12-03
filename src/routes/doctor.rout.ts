import {Router} from 'express';

// Controllers
import DoctorController from "../controller/doctor.controller";

const doctor = Router();

doctor.post('/', DoctorController.createDoctor);

export default doctor;
