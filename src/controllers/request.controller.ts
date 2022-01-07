import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

import { pool } from '../database';
import { queries } from '../utils/queries';
import { RequestStatus } from '../utils/requestStatus';

export const createRequest = async (req: Request, res: Response): Promise<Response> => {
  const { documentType, description, idUser } = req.body;
  try {
    if (!documentType || !description) {
      console.log('a');
      return res.status(422).json({
        status: 422,
        message: 'Por favor, completa todos los campos'
      });
    };

    const request = await pool.query(queries.CREATE_REQUEST, [documentType, RequestStatus.PENDING,
      description, idUser]);
    return res.status(200).json({
      status: 200, message: 'Solicitud creada exitosamente',
      request: request.rows[0]
    });
  } catch (e) {
    return res.status(422).json({ status: 422, message: 'Error de servidor' });
  }
};

export const getRequests = async (req: Request, res: Response): Promise<Response> => {
  try {
    const requests = await pool.query(queries.GET_REQUESTS);
    return res.status(200).json({ status: 200, requests: requests.rows });
  } catch (e) {
    return res.status(422).json({ status: 422, message: 'Error de servidor', error: e });
  }
};

export const getRequestById = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const request = await pool.query(queries.GET_INFO_REQUEST, [id]);
    return res.status(200).json({ status: 200, request: request.rows[0] });
  } catch (e) {
    return res.status(422).json({ status: 422, message: 'Error de servidor', error: e });
  }
};

export const getRequestsByUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const request = await pool.query(queries.GET_REQUESTS_BY_USER, [id]);
    return res.status(200).json({ status: 200, requests: request.rows });
  } catch (e) {
    console.log(e);
    return res.status(422).json({ status: 422, message: 'Error de servidor', error: e });
  }
};

export const getRequestStatus = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const request = await pool.query(queries.GET_REQUEST_STATUS, [id]);
    return res.status(200).json({ status: 200, request: request.rows[0] });
  } catch (e) {
    return res.status(422).json({ status: 422, message: 'Error de servidor', error: e });
  }
};

export const updateRequest = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { description } = req.body;
  try {
    const updatedRequest = await pool.query(queries.UPDATE_REQUEST, [description, id]);
    return res.status(200).json({
      status: 200, message: 'Solicitud actualizada exitosamente',
      updatedRequest: updatedRequest.rows[0]
    });
  } catch (e) {
    console.log(e);
    return res.status(422).json({ status: 422, message: 'Error de servidor', error: e });
  }
}

export const deleteRequest = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    await pool.query(queries.DELETE_REQUEST, [id]);
    return res.status(200).json({
      status: 200, message: 'Solicitud eliminada exitosamente',
    });
  } catch (e) {
    console.log(e);
    return res.status(422).json({ status: 422, message: 'Error de servidor', error: e });
  }
}

export const sendMailAndUpdateRequestStatus = async (req: Request, res: Response) => {
  const { email, admin } = req.body;
  const { originalname, path } = req.file as any;
  const { id } = req.params;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.USER_MAIL_PASSWORD
    },
  });
  try {
    if (admin) {
      const updatedRequestStatus = await pool.query(queries.UPDATE_REQUEST_STATUS, [RequestStatus.COMPLETED,
        originalname, id]);
      await transporter.sendMail({
        from: process.env.USER_MAIL,
        to: email,
        subject: 'Envío de documento',
        attachments: [
          {
            filename: originalname,
            path,
          }
        ]
      });
      return res.status(200).json({
        status: 200, message: 'Documento enviado exitosamente',
        updatedRequestStatus: updatedRequestStatus.rows[0]
      });
    } else {
      return res.status(422).json({ status: 422, message: 'No tienes permisos para realizar la siguiente acción' });
    }
  } catch (e) {
    console.log(e);
    return res.status(422).json({ status: 422, error: e });
  }
};
