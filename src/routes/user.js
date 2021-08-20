import express from "express"
import { login, register, update } from "../controllers/user.js";
import { loginValidator, registerValidator, updateValidator } from "./validator.js";

const routes = express.Router();

routes.post('/login', loginValidator, login)
routes.post('/register', registerValidator, register)
routes.post('/update', update)

export default routes;