import {Request, Response} from 'express';

import DoctorModel from "../model/Doctors";

class DoctorController {
  public static async createDoctor(req: Request, res: Response): Promise<void> {
    try {
      const data = await DoctorModel.create(req.body);

      res.status(201).json(`Doctor has been created! Your id ${data._id}`);
    } catch (e) {
      res.status(400).json({message: e.message});
    }
  }
}

export default DoctorController;
