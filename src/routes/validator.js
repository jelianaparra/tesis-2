import { body } from "express-validator"

export const loginValidator = [
    body('email').isEmail(),
    body('password').isLength({min: 6, max: 25})
]

export const registerValidator = [
    body('nombre').isAlpha().isLength({min: 3, max: 20}),
    body('apellido').isAlpha().isLength({min: 3, max: 25}),
    body('cedula').isNumeric({min: 1000, max: 10000}),
    body('email').isEmail().isLength({min: 6, max: 25}),
    body('password').isLength({min: 6, max: 25})
]
export const updateValidator = [
    body('nombre').isAlpha().isLength({min: 3, max: 20}).optional(),
    body('apellido').isAlpha().isLength({min: 3, max: 25}).optional(),
    body('cedula').isNumeric({min: 1000, max: 10000}).optional,
    body('email').isEmail().isLength({min: 6, max: 25}),
    body('id').isNumeric({min: 1}),
]

export const showValidator = [
    body('id').isNumeric({min: 1})
]

export const requestValidator = [
    body('description').isAlpha(),
    body('fecha').isDate(),
    body('usuario').isNumeric({min: 1}),
    body('tipo').isNumeric({min: 1})
]

export const uRequestValidator = [
    body('description').isAlpha(),
    body('fecha').isDate(),
    body('usuario').isNumeric({min: 1}),
    body('tipo').isNumeric({min: 1}),
    body('id').isNumeric({min: 1})
]