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
exports.signIn = exports.signUp = void 0;
const bcryptjs_1 = require("bcryptjs");
const queries_1 = require("../utils/queries");
const database_1 = require("../database");
const Strategies_1 = require("../utils/Strategies");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, document, email, key, admin } = req.body;
    try {
        if (!name || !document || !email || !key) {
            console.log('a');
            return res.status(422).json({
                status: 422,
                error: 'Por favor, completa todos los campos'
            });
        }
        ;
        const savedUser = yield database_1.pool.query(queries_1.queries.CHECK_USER, [email, document]);
        if (savedUser.rows.length !== 0)
            return res.status(422).json({
                status: 422,
                error: 'El usuario ya existe'
            });
        const salt = (0, bcryptjs_1.genSaltSync)(10);
        const hashedPassword = (0, bcryptjs_1.hashSync)(key, salt);
        const user = yield database_1.pool.query(queries_1.queries.SIGN_UP, [name, document, email,
            hashedPassword, admin]);
        const _a = user.rows[0], { password } = _a, rest = __rest(_a, ["password"]);
        return res.status(200).json({ status: 200, message: 'Usuario registrado exitosamente', user: rest });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ status: 500, message: 'Error de servidor', error: e });
    }
    ;
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { document, email, key } = req.body;
    try {
        if (!email || !key)
            return res.status(422).json({
                status: 422,
                error: 'Por favor, completa todos los campos'
            });
        const savedUser = yield database_1.pool.query(queries_1.queries.CHECK_USER, [email, document]);
        if (savedUser.rows.length === 0)
            return res.status(422).json({
                status: 422,
                error: 'Correo o contraseña inválidos'
            });
        const passFromDB = yield database_1.pool.query(queries_1.queries.GET_PASSWORD, [email]);
        const correctCreds = yield (0, bcryptjs_1.compare)(key, passFromDB.rows[0].password);
        const user = yield database_1.pool.query(queries_1.queries.GET_USER, [document, email]);
        const _b = user.rows[0], { password } = _b, rest = __rest(_b, ["password"]);
        if (correctCreds) {
            return res.status(200).json({
                status: 200,
                message: 'Sesión iniciada exitosamente',
                token: (0, Strategies_1.createToken)(email),
                user: rest,
            });
        }
        return res.status(422).json({ status: 422, error: 'Correo o contraseña inválidos' });
    }
    catch (e) {
        return res.status(500).json({ status: 500, message: 'Error de servidor', error: e });
    }
    ;
});
exports.signIn = signIn;
