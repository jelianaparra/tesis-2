import { Request, Response } from 'express';
import { compare, genSaltSync, hashSync } from 'bcryptjs';
import { QueryResult } from 'pg';

import { queries } from '../utils/queries';
import { pool } from '../database';
import { createToken } from '../utils/Strategies';

export const signUp = async (req: Request, res: Response): Promise<Response> => {
  const { name, document, email, key, admin } = req.body;
  try {
    if (!name || !document || !email || !key) {
      console.log('a');
      return res.status(422).json({
        status: 422,
        error: 'Por favor, completa todos los campos'
      });
    };
    const savedUser: QueryResult = await pool.query(queries.CHECK_USER, [email, document]);
    if (savedUser.rows.length !== 0) return res.status(422).json({
      status: 422,
      error: 'El usuario ya existe'
    });
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(key, salt);
    const user: QueryResult = await pool.query(queries.SIGN_UP, [name, document, email,
      hashedPassword, admin]);
    const { password, ...rest } = user.rows[0];
    return res.status(200).json({ status: 200, message: 'Usuario registrado exitosamente', user: rest });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 500, message: 'Error de servidor', error: e });
  };
};

export const signIn = async (req: Request, res: Response): Promise<Response> => {
  const { document, email, key } = req.body;
  try {
    if (!document || !email || !key) return res.status(422).json({
      status: 422,
      error: 'Por favor, completa todos los campos'
    });
    const savedUser: QueryResult = await pool.query(queries.CHECK_USER, [email, document]);
    if (savedUser.rows.length === 0) return res.status(422).json({
      status: 422,
      error: 'Correo o contraseña inválidos'
    });
    const passFromDB: QueryResult = await pool.query(queries.GET_PASSWORD, [email]);
    const correctCreds = await compare(key, passFromDB.rows[0].password);
    const user: QueryResult = await pool.query(queries.GET_USER, [document, email]);
    const { password, ...rest } = user.rows[0];
    if (correctCreds) {
      return res.status(200).json({
        status: 200,
        message: 'Sesión iniciada exitosamente',
        token: createToken(email),
        user: rest,
      });
    }
    return res.status(422).json({ status: 422, error: 'Correo o contraseña inválidos' });
  } catch (e) {
    return res.status(500).json({ status: 500, message: 'Error de servidor', error: e });
  };
};
