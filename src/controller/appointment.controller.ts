import {Response, Request} from 'express';
import {CronJob} from 'cron';

// Utils
import {logger} from '../utils/logger';

// Models
import UserModel from '../model/Users';
import DoctorModel from '../model/Doctors';
import BookedUsers from "../model/BookedUsers";

class AppointmentController {
  public static async MakeAppointment(req: Request, res: Response): Promise<void> {
    try {
      const {user_id, doctor_id, slot} = req.body;
      const optionDate = {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',};

      const checkTime = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01]) ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(slot);
      if (!checkTime) {
        throw new Error('Please enter correct date or time. Format date/time (yyyy-mm-dd hh:mm)');
      }

      const user = await UserModel.findById({_id: user_id});
      if (!user) {
        throw new Error('User not found!');
      }

      const doctor = await DoctorModel.findById({_id: doctor_id});
      if (!doctor) {
        throw new Error('Doctor not found!');
      }

      const doctorTime = await DoctorModel.findOne({_id: doctor.id, slots: new Date(slot)});
      const doctorSlots = doctor.slots.map(i => i.toLocaleString("ru-RU", optionDate));
      if (!doctorTime) {
        throw new Error(`Date not found. The doctor: ${doctor.name} has these dates: ${(doctorSlots.length) ? doctorSlots : 'No date'} for appointment `);
      }

      const registered = await BookedUsers.create({user_id, doctor_id, slot: new Date(slot)});
      if (!registered) {
        throw new Error('Enter correct data!');
      }
      await DoctorModel.findOneAndUpdate({_id: doctor.id, slots: new Date(slot)}, {$pull: {slots: new Date(slot)}});

      // Оповещения.
      const dateNow = new Date();
      const registeredDate = new Date(slot);

      if (dateNow.getDate() < registeredDate.getDate()) {
        const date = new Date(slot);
        date.setDate(date.getDate() - 1);
        date.setHours(dateNow.getHours());
        date.setMinutes(dateNow.getMinutes() + 1);

        const job = new CronJob(date, (() => {
          logger.info(`| Привет ${user.name}! Напоминаем что вы записаны к ${doctor.spec} завтра в ${registeredDate.toLocaleString("ru-RU", optionDate)}`);
        }));
        job.start();
      }

      if (dateNow.getHours() <= (registeredDate.getHours() - 2) && dateNow.getDate() === registeredDate.getDate()) {
        const date = new Date(slot);
        date.setHours(date.getHours() - 2);

        const job = new CronJob(date, (() => {
          logger.info(`| Привет ${user.name}! Вам через 2 часа к ${doctor.spec} в ${registeredDate.toLocaleString("ru-RU", optionDate)}`);
        }));
        job.start();
      }

      logger.info(`| Привет ${user.name}! Вас записали к врачу ${doctor.spec} на такую дату ${registeredDate.toLocaleString("ru-RU", optionDate)}. Хорошего дня!`);
      res.send(`You were booked to the doctor: ${doctor.name}. Have a good day!`);
    } catch (e) {
      res.status(400).json({message: e.message});
    }
  }
}

export default AppointmentController;
