"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMailAndUpdateRequestStatus = exports.deleteRequest = exports.updateRequest = exports.getRequestStatus = exports.getRequestsByUser = exports.getRequestById = exports.getRequests = exports.createRequest = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const database_1 = require("../database");
const queries_1 = require("../utils/queries");
const requestStatus_1 = require("../utils/requestStatus");
const createRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { documentType, description, idUser } = req.body;
    try {
        if (!documentType || !description) {
            console.log('a');
            return res.status(422).json({
                status: 422,
                message: 'Por favor, completa todos los campos'
            });
        }
        ;
        const request = yield database_1.pool.query(queries_1.queries.CREATE_REQUEST, [documentType, requestStatus_1.RequestStatus.PENDING,
            description, idUser]);
        return res.status(200).json({
            status: 200, message: 'Solicitud creada exitosamente',
            request: request.rows[0]
        });
    }
    catch (e) {
        return res.status(422).json({ status: 422, message: 'Error de servidor' });
    }
});
exports.createRequest = createRequest;
const getRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield database_1.pool.query(queries_1.queries.GET_REQUESTS);
        return res.status(200).json({ status: 200, requests: requests.rows });
    }
    catch (e) {
        return res.status(422).json({ status: 422, message: 'Error de servidor', error: e });
    }
});
exports.getRequests = getRequests;
const getRequestById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const request = yield database_1.pool.query(queries_1.queries.GET_INFO_REQUEST, [id]);
        return res.status(200).json({ status: 200, request: request.rows[0] });
    }
    catch (e) {
        return res.status(422).json({ status: 422, message: 'Error de servidor', error: e });
    }
});
exports.getRequestById = getRequestById;
const getRequestsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const request = yield database_1.pool.query(queries_1.queries.GET_REQUESTS_BY_USER, [id]);
        return res.status(200).json({ status: 200, requests: request.rows });
    }
    catch (e) {
        console.log(e);
        return res.status(422).json({ status: 422, message: 'Error de servidor', error: e });
    }
});
exports.getRequestsByUser = getRequestsByUser;
const getRequestStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const request = yield database_1.pool.query(queries_1.queries.GET_REQUEST_STATUS, [id]);
        return res.status(200).json({ status: 200, request: request.rows[0] });
    }
    catch (e) {
        return res.status(422).json({ status: 422, message: 'Error de servidor', error: e });
    }
});
exports.getRequestStatus = getRequestStatus;
const updateRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { description } = req.body;
    try {
        const updatedRequest = yield database_1.pool.query(queries_1.queries.UPDATE_REQUEST, [description, id]);
        return res.status(200).json({
            status: 200, message: 'Solicitud actualizada exitosamente',
            updatedRequest: updatedRequest.rows[0]
        });
    }
    catch (e) {
        console.log(e);
        return res.status(422).json({ status: 422, message: 'Error de servidor', error: e });
    }
});
exports.updateRequest = updateRequest;
const deleteRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield database_1.pool.query(queries_1.queries.DELETE_REQUEST, [id]);
        return res.status(200).json({
            status: 200, message: 'Solicitud eliminada exitosamente',
        });
    }
    catch (e) {
        console.log(e);
        return res.status(422).json({ status: 422, message: 'Error de servidor', error: e });
    }
});
exports.deleteRequest = deleteRequest;
const sendMailAndUpdateRequestStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, admin } = req.body;
    const { originalname, path } = req.file;
    const { id } = req.params;
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_MAIL,
            pass: process.env.USER_MAIL_PASSWORD
        },
    });
    try {
        if (admin) {
            const updatedRequestStatus = yield database_1.pool.query(queries_1.queries.UPDATE_REQUEST_STATUS, [requestStatus_1.RequestStatus.COMPLETED,
                originalname, id]);
            yield transporter.sendMail({
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
        }
        else {
            return res.status(422).json({ status: 422, message: 'No tienes permisos para realizar la siguiente acción' });
        }
    }
    catch (e) {
        console.log(e);
        return res.status(422).json({ status: 422, error: e });
    }
});
exports.sendMailAndUpdateRequestStatus = sendMailAndUpdateRequestStatus;
