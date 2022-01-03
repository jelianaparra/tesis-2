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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = void 0;
const database_1 = require("../database");
const queries_1 = require("../utils/queries");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield database_1.pool.query(queries_1.queries.GET_USER_INFO, [id]);
        const _a = user.rows[0], { password } = _a, rest = __rest(_a, ["password"]);
        return res.status(200).json({ status: 200, user: rest });
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({ status: 422, message: 'Error de servidor', error: e });
    }
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    const { id } = req.params;
    try {
        const user = yield database_1.pool.query(queries_1.queries.UPDATE_USER, [name, email, id]);
        return res.status(200).json({ status: 200, message: 'Usuario actualizado exitosamente', user: user.rows[0] });
    }
    catch (e) {
        console.log(e);
        return res.status(422).json({ status: 422, message: 'El correo ya existe' });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield database_1.pool.query(queries_1.queries.GET_USER_INFO, [id]);
    if (user.rows.length === 0) {
        return res.status(200).json({ status: 200, message: 'Usuario no encontrado' });
    }
    yield database_1.pool.query(queries_1.queries.DELETE_USER, [id]);
    return res.status(200).json({ status: 200, message: 'Usuario eliminado exitosamente' });
});
exports.deleteUser = deleteUser;
