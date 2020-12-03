import {Schema, model, Document} from 'mongoose';

// Interface
import {IUsers} from '../interfaces/IUsers';

const setUserModel = new Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\+380([ .-]?)[0-9]{2}\1[0-9]{3}\1[0-9]{2}\1[0-9]{2}|^\+7([ .-]?)[0-9]{3}\2[0-9]{3}\2[0-9]{2}\2[0-9]{2}/,
      'Enter correct phone!'
    ]
  },
  name: {
    type: String,
    required: true
  }
});

const UserModel = model<IUsers & Document>('User', setUserModel);

export default UserModel;
