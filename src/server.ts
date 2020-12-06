// Libs
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// App
import app from "./index";

// Utils
import {errorLogger} from "./utils/error";
import {job} from './utils/clearPastDate';


const PORT: number | string = process.env.PORT || 5000;

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

    job.start();
  } catch (e) {
    errorLogger.error(e.message);
  }
})();
