import { body } from "express-validator"

export const loginValidator = [
    body('username').isAlphanumeric().isLength({min: 5, max: 20}),
    body('password').isLength({min: 6, max: 25})
]