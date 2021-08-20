import express from "express"
import { login, register } from "../controllers/user.js";
import { loginValidator, registerValidator } from "./validator.js";

const routes = express.Router();

routes.post('/login', loginValidator, login)
routes.post('/register', registerValidator, register)

export default routes;