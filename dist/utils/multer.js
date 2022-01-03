"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUpload = exports.photoFilter = exports.storage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
exports.storage = multer_1.default.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, Math.round(Math.random() * 1E9) + path_1.default.extname(file.originalname));
    }
});
const photoFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|xls|xlsx|pdf)$/)) {
        cb(null, false);
    }
    cb(null, true);
};
exports.photoFilter = photoFilter;
exports.fileUpload = (0, multer_1.default)({
    storage: exports.storage,
    fileFilter: exports.photoFilter,
    limits: { fieldSize: 1024 * 1024 }
}).single('document');
