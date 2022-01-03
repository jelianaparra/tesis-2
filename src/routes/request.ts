import { Router } from 'express';

import {
  createRequest, deleteRequest, getRequestById, getRequests, getRequestsByUser, getRequestStatus,
  sendMailAndUpdateRequestStatus,
  updateRequest
}
  from '../controllers/request.controller';
import { fileUpload } from '../utils/multer';

const router = Router();

router.route('/')
  .get(getRequests)
  .post(createRequest)

router.route('/:id')
  .get(getRequestById)
  .patch(updateRequest)
  .delete(deleteRequest)

router.route('/status/:id')
  .get(getRequestStatus)

router.get('/user/:id', getRequestsByUser);

router.put('/status/mail/:id', fileUpload, sendMailAndUpdateRequestStatus);

export default router;