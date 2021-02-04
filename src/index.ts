// Libs
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser";

// Routs
import appointment from "./routes/appointment.rout";
import user from "./routes/user.rout";
import doctor from "./routes/doctor.rout";

const app = express();

// Middleware
app.use(bodyParser.json());

// Routs
app.use('/appointment', appointment);
app.use('/user', user);
app.use('/doctor', doctor);
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: `Path ${req.originalUrl} not found!` });
  next();
});

export default app;
