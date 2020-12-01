import express, {Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from "body-parser";

// Routs
import appointment from "./routes/appointment.rout";

// Utils
import {errorLogger} from "./utils/error";

dotenv.config();

const PORT: number | string = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(bodyParser.json());

// Routs
app.use('/appointment', appointment);
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({message: `Path ${req.originalUrl} not found!`});
  next();
});

// Setting mongoose.
const optMongo = {
  promiseLibrary: global.Promise,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: false,
};

// Connecting mongodb and starting server
(async () => {
  try {
    await mongoose.connect(`${process.env.DB}`, optMongo);

    app.listen(PORT, () => {
      console.log(`Server has been started! PORT ${PORT}`);
    });
  } catch (e) {
    errorLogger.error(e.message);
  }
})();
