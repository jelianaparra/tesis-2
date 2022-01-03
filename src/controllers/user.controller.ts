import { Request, Response } from 'express';
import { QueryResult } from 'pg';

import { pool } from '../database';
import { queries } from '../utils/queries';

export const getUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const user: QueryResult = await pool.query(queries.GET_USER_INFO, [id]);
    const { password, ...rest } = user.rows[0];
    return res.status(200).json({ status: 200, user: rest })
  } catch (e) {
    console.log(e);
    return res.status(200).json({ status: 422, message: 'Error de servidor', error: e });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const { name, email } = req.body;
  const { id } = req.params;
  try {
    const user: QueryResult = await pool.query(queries.UPDATE_USER, [name, email, id]);
    return res.status(200).json({ status: 200, message: 'Usuario actualizado exitosamente', user: user.rows[0] });
  } catch (e) {
    console.log(e);
    return res.status(422).json({ status: 422, message: 'El correo ya existe' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const user: QueryResult = await pool.query(queries.GET_USER_INFO, [id]);
  if (user.rows.length === 0) {
    return res.status(200).json({ status: 200, message: 'Usuario no encontrado' });
  }
  await pool.query(queries.DELETE_USER, [id]);
  return res.status(200).json({ status: 200, message: 'Usuario eliminado exitosamente' });
};