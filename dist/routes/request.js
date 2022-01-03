"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const request_controller_1 = require("../controllers/request.controller");
const multer_1 = require("../utils/multer");
const router = (0, express_1.Router)();
router.route('/')
    .get(request_controller_1.getRequests)
    .post(request_controller_1.createRequest);
router.route('/:id')
    .get(request_controller_1.getRequestById)
    .patch(request_controller_1.updateRequest)
    .delete(request_controller_1.deleteRequest);
router.route('/status/:id')
    .get(request_controller_1.getRequestStatus);
router.get('/user/:id', request_controller_1.getRequestsByUser);
router.put('/status/mail/:id', multer_1.fileUpload, request_controller_1.sendMailAndUpdateRequestStatus);
exports.default = router;
