import express from "express"
import { login } from "../controllers/user.js";
import { loginValidator } from "./validator.js";

const routes = express.Router();

routes.post('/login', loginValidator, login)
// routes.post('/rregister', loginValidator, register)

export default routes;