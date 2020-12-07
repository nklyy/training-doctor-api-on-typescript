import {Router} from 'express';

// Controllers
import DoctorController from "../controller/doctor.controller";

const doctor = Router();

doctor.post('/', DoctorController.createDoctor);
doctor.put('/add-date', DoctorController.addDoctorDateTime);

export default doctor;
