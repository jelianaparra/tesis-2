import { body } from "express-validator"
import { connect } from "../database.js"

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

export const docValidator = [
    body('descripcion').isAlpha().isLength({min: 5, max: 100})
]
export const uDocValidator = [
    body('id').isNumeric({min: 1}),
    body('descripcion').isAlpha().isLength({min: 5, max: 100})
]

export const usuarioPuede = async  (perfil, permisoToCheck) => {
    return await connect().then(async (pool) => {
         let result = await  pool
        .query(
          "select * from perfil join permiso using(id_perfil) join proceso on proceso.id_proceso=permiso.id_proceso where id_perfil=$1",
          [perfil]
        )
        .then((data) => {
          if (data.rowCount === 0) {
           return (false);
          }
          for (let permiso = 0; permiso < data.rows.length; permiso++) {
            const element = data.rows[permiso].de_proceso;
            if (element === permisoToCheck) {
              return (true)
            }
          }
          return (false)
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
        console.log('re',result)
        return result;
    }) 
}