import {Router} from 'express';

// Controllers
import UserController from "../controller/user.controller";

const user = Router();

user.post('/', UserController.createUser);

export default user;
