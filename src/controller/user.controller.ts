import {Request, Response} from 'express';

import UserModel from "../model/Users";

class UserController {
  public static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const {phone, name} = req.body;

      const regExp = /^\+380([ .-]?)[0-9]{2}\1[0-9]{3}\1[0-9]{2}\1[0-9]{2}|^\+7([ .-]?)[0-9]{3}\2[0-9]{3}\2[0-9]{2}\2[0-9]{2}$/;
      const checkPhone = phone.match(regExp);

      if (checkPhone[0] !== checkPhone.input) {
        throw new Error("Please enter correct phone!");
      }

      const user = await UserModel.findOne({phone});

      if (user) {
        throw new Error('User already exist!');
      }

      await UserModel.create({name, phone});

      res.status(201).json({message: 'User has been created!'});
    } catch (e) {
      res.status(400).json({message: e.message});
    }
  }
}

export default UserController;
