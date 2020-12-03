import {CronJob} from "cron";
import DoctorModel from "../model/Doctors";
import {errorLogger} from "./error";

export const job = new CronJob("0 0 */6 * * *", (async () => {
  const doctors = await DoctorModel.find({});

  if (doctors.length) {
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - 1);

    doctors.forEach(i => {
      i.slots = i.slots.filter(date => date > pastDate);
      i.save().catch(err => errorLogger.error(err.message));
    });
  }
}));
