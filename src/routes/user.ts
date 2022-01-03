import { Router } from 'express';
import { deleteUser, getUser, updateUser } from '../controllers/user.controller';

const router = Router();

router.route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

export default router;