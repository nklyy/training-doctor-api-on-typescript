import {Request, Response} from 'express';

import DoctorModel from "../model/Doctors";

class DoctorController {
  public static async createDoctor(req: Request, res: Response): Promise<void> {
    try {
      const {slots} = req.body;

      if (!Array.isArray(slots)) {
        throw new Error('Slots should be Array Date!');
      }

      const data = await DoctorModel.create(req.body);

      res.status(201).json({message: 'Doctor has been created!', id: data._id});
    } catch (e) {
      res.status(400).json({message: e.message});
    }
  }

  public static async addDoctorDateTime(req: Request, res: Response): Promise<void> {
    try {
      const {doctor_id, dateTime} = req.body;

      const doctor = await DoctorModel.findById({_id: doctor_id});
      if (!doctor) {
        throw new Error('Doctor not found!');
      }

      if (!Array.isArray(dateTime)) {
        throw new Error('Slots should be Array Date!');
      }

      // Проверка даты
      const optionDate = {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',};
      const dateArray: Date[] = [];

      for (const i of dateTime) {
        const date = new Date(i).toLocaleString("ru-RU", optionDate);
        const checkDate = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01]) ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(date);

        if (date < new Date().toLocaleString("ru-RU", optionDate) || !checkDate) {
          throw new Error('You entered a past date or wrong format date. Date format (yyyy-mm-dd hh:mm)');
        }

        dateArray.push(new Date(i));
      }

      const doctorTime = await DoctorModel.findOne({_id: doctor_id, slots: {$in: dateArray}});
      if (doctorTime) {
        throw new Error('Some date already exist!');
      }

      // Добавление даты.
      doctor.slots.push(...dateArray);
      await doctor.save();

      res.status(200).json({message: 'Date has been added!'});
    } catch (e) {
      res.status(400).json({message: e.message});
    }
  }
}

export default DoctorController;
