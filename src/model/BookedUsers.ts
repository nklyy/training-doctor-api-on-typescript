import {Schema, model, Types, Document} from 'mongoose';

// Utils
import {errorLogger} from '../utils/error';

// Interface
import {IBookedUsers} from '../interfaces/IBookedUsers';

const setBookedUsersModel = new Schema({
  user_id: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor_id: {
    type: Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  slot: {
    type: Date,
    required: true,
    match: [
      /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01]) ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Please enter correct date or time. Format date/time (yyyy-mm-dd hh:mm)'
    ]
  }
});

setBookedUsersModel.index({slot: 1}, {expireAfterSeconds : 1800});

const BookedUsers = model<IBookedUsers & Document>('BookedUsers', setBookedUsersModel);

BookedUsers.createIndexes()
  .catch(err => errorLogger.error(err.message));

export default BookedUsers;
