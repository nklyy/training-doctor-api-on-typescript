import {Schema, model, Document} from 'mongoose';
import moment from "moment";

// Interface
import {IDoctors} from '../interfaces/IDoctors';

const setDoctorModel = new Schema({
  name: {
    type: String,
    required: true
  },
  spec: {
    type: String,
    required: true,
  },
  slots: [{
    type: Date,
    required: true
  }]
});

setDoctorModel.path('slots').validate(function (v: string[]) {
  for (const i of v) {
    const date = new Date(i);
    const normalizeDate = moment(date).format('YYYY-MM-DD HH:mm');
    const checkDate = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01]) ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(normalizeDate);

    if (normalizeDate < moment(new Date()).format('YYYY-MM-DD HH:mm') || !checkDate) {
      return false;
    }
  }
  return true;
}, 'You entered a past date or wrong format date. Date format (yyyy-mm-dd hh:mm)');

const DoctorModel = model<IDoctors & Document>('Doctor', setDoctorModel);

export default DoctorModel;
